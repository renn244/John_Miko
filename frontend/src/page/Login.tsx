import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LoginForm from '@/forms/LoginForm';
import { Link } from 'react-router';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl overflow-hidden py-0">
        <div className="flex flex-col md:flex-row">
          
          <div className="flex-1 order-2 md:order-1">

            <ImageMobile />

            <div className="p-8 md:p-10">

              <div className="text-center md:text-left mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#1F2937' }}>
                  Welcome Back
                </h2>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Sign in to continue
                </p>
              </div>

              <LoginForm />

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: '#E5E7EB' }} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white" style={{ color: '#6B7280' }}>
                    or
                  </span>
                </div>
              </div>

              <Link to="/">
                <Button className='w-full mt-3'>
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          <ImageDesktop />
        </div>
      </Card>
    </div>
  );
}

const ImageMobile = () => (
  <div className="relative h-40 overflow-hidden md:hidden">
    <img
    src="https://images.unsplash.com/photo-1729707691048-722c1acf5c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzcyMDk4MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    alt="Resort View"
    className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60" />
    
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-1">
          John Miko's Place
        </h1>
        <p className="text-sm text-white/90">Public Resort</p>
      </div>
    </div>
  </div>
)

const ImageDesktop = () => (
  <div className="hidden md:block md:w-2/5 relative order-1 md:order-2">
    <img
    src="https://images.unsplash.com/photo-1729707691048-722c1acf5c51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHJlc29ydCUyMHBvb2x8ZW58MXx8fHwxNzcyMDk4MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    alt="Resort View"
    className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-linear-to-l from-transparent to-black/10" />
    
    <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">
          John Miko's Place
        </h1>
        <p className="text-lg text-white/90 mb-2">
          Public Resort
        </p>
        <p className="text-sm text-white/80 mb-8">
          Experience paradise with modern comfort
        </p>
      </div>
    </div>
  </div>
)