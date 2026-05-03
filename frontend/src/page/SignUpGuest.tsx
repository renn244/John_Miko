import NavBar from '@/components/common/NavBar';
import SignUpGuestForm from '@/forms/SignUpGuestForm';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router';

export default function SignUpGuest() {
  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F1F5F9' }}>
      <NavBar />
      
      <div className="my-auto flex items-center justify-center p-4 mt-4 md:mt-8">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">

          <div className="grid md:grid-cols-2">

            <div className="hidden md:block relative h-full min-h-175">
              <img
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxyZXNvcnQlMjBwb29sJTIwdHJvcGljYWx8ZW58MXx8fHwxNzMzMDk4MDA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Resort Pool"
              className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-br from-blue-600/40 to-blue-800/90" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    Join Our Resort Community
                  </h2>
                  <p className="text-lg mb-6 text-white/90">
                    Create your account and start booking your dream vacation at John Miko's Place Public Resort
                  </p>
                  <div className="space-y-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold">Easy Booking</p>
                        <p className="text-sm text-white/80">Quick and hassle-free reservation process</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold">Exclusive Deals</p>
                        <p className="text-sm text-white/80">Get special discounts for members</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold">Manage Bookings</p>
                        <p className="text-sm text-white/80">View and manage your reservations anytime</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">

              <div className="md:hidden text-center mb-6">
                <h1 className="text-2xl font-bold mb-1 text-primary">
                  John Miko's Place
                </h1>
                <p className="text-sm text-muted-foreground">Public Resort</p>
              </div>

              <div className="text-center md:text-left mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-1">
                  Create Your Account
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill in your details to get started
                </p>
              </div>

              <SignUpGuestForm />

              <div className="text-center mt-6">
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold hover:underline text-blue-600">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
