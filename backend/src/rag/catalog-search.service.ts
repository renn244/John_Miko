import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CatalogEvidence } from './rag.types';

export const CATALOG_CACHE_KEY = 'public-catalog';

const rawTokens = (value: string): string[] =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length >= 2);

const STOP_WORDS = new Set([
  'about',
  'and',
  'are',
  'can',
  'even',
  'for',
  'from',
  'how',
  'it',
  'me',
  'please',
  'really',
  'that',
  'tell',
  'the',
  'wait',
  'what',
  'when',
  'where',
  'with',
  'you',
]);

const tokens = (value: string): string[] =>
  rawTokens(value).filter((token) => !STOP_WORDS.has(token));

const ACCOMMODATION_TERMS = new Set([
  'accommodation',
  'accommodations',
  'cottage',
  'cottages',
  'dormitory',
  'lodging',
  'room',
  'rooms',
  'stay',
]);
const MENU_TERMS = new Set([
  'dish',
  'dishes',
  'drink',
  'drinks',
  'food',
  'foods',
  'meal',
  'meals',
  'menu',
]);
const ADDON_TERMS = new Set([
  'addon',
  'addons',
  'karaoke',
  'service',
  'services',
]);
const LIST_TERMS = new Set([
  'all',
  'available',
  'list',
  'options',
  'other',
  'accommodations',
  'cottages',
  'rooms',
  'dishes',
  'drinks',
  'foods',
  'meals',
  'addons',
  'services',
]);

type CatalogCandidate = CatalogEvidence & {
  searchValues: string[];
};

@Injectable()
export class CatalogSearchService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async search(question: string, limit = 5): Promise<CatalogEvidence[]> {
    const questionTokens = rawTokens(question);
    const queryTokens = tokens(question);
    if (queryTokens.length === 0) return [];

    const candidates = await this.loadCandidates();
    const matchedCandidates = this.matchCandidates(
      candidates,
      questionTokens,
      queryTokens,
      limit,
    );

    return matchedCandidates;
  }

  private async loadCandidates(): Promise<CatalogCandidate[]> {
    const cached = await this.cache.get<CatalogCandidate[]>(CATALOG_CACHE_KEY);
    if (cached) return cached;

    const [accommodations, menuItems, addOns] = await Promise.all([
      this.prisma.accommodation.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          capacity: true,
          price: true,
          isGuestFeeWaived: true,
          amenities: true,
          stayOptions: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            select: {
              label: true,
              durationHours: true,
              startTime: true,
              endTime: true,
            },
          },
        },
        take: 25,
      }),
      this.prisma.menuItem.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          price: true,
          availability: true,
        },
        take: 25,
      }),
      this.prisma.addOnService.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          isActive: true,
        },
        take: 25,
      }),
    ]);

    const candidates: CatalogCandidate[] = [
      ...accommodations.map((item) => ({
        id: item.id,
        type: 'accommodation' as const,
        title: item.name,
        text: JSON.stringify(item),
        searchValues: [
          item.name,
          item.description ?? '',
          item.type,
          item.amenities.join(' '),
        ],
      })),
      ...menuItems.map((item) => ({
        id: item.id,
        type: 'menu' as const,
        title: item.name,
        text: JSON.stringify(item),
        searchValues: [item.name, item.description, item.category],
      })),
      ...addOns.map((item) => ({
        id: item.id,
        type: 'addon' as const,
        title: item.name,
        text: JSON.stringify(item),
        searchValues: [item.name, item.description ?? ''],
      })),
    ];

    await this.cache.set(CATALOG_CACHE_KEY, candidates);
    return candidates;
  }

  private matchCandidates(
    candidates: CatalogCandidate[],
    questionTokens: string[],
    queryTokens: string[],
    limit: number,
  ): CatalogEvidence[] {
    const scopes = this.getRequestedScopes(questionTokens);
    const isListQuestion = questionTokens.some((token) =>
      LIST_TERMS.has(token),
    );
    const includeAllScoped = scopes.size > 0 && isListQuestion;
    const scoped = scopes.size
      ? candidates.filter((item) => scopes.has(item.type))
      : candidates;

    return scoped
      .map((item) => ({
        ...item,
        score: this.score(queryTokens, item.searchValues),
      }))
      .filter((item) => includeAllScoped || item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(limit, 10))
      .map(({ score: _score, searchValues: _searchValues, ...item }) => item);
  }

  private getRequestedScopes(
    questionTokens: string[],
  ): Set<CatalogEvidence['type']> {
    const scopes = new Set<CatalogEvidence['type']>();
    if (questionTokens.some((token) => ACCOMMODATION_TERMS.has(token))) {
      scopes.add('accommodation');
    }
    if (questionTokens.some((token) => MENU_TERMS.has(token))) {
      scopes.add('menu');
    }
    if (questionTokens.some((token) => ADDON_TERMS.has(token))) {
      scopes.add('addon');
    }

    return scopes;
  }

  private score(queryTokens: string[], values: string[]): number {
    const haystack = new Set(tokens(values.join(' ')));
    return queryTokens.reduce(
      (score, token) => score + (haystack.has(token) ? 1 : 0),
      0,
    );
  }
}
