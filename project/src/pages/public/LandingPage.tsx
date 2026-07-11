import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiStar, FiUsers, FiCheckCircle, FiArrowRight, FiPhone } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const features = [
  { icon: FiCalendar, title: 'Easy Booking', desc: 'Reserve your table in seconds with our intuitive booking system.' },
  { icon: FiClock, title: 'Flexible Times', desc: 'Choose from multiple time slots that fit your schedule perfectly.' },
  { icon: FiUsers, title: 'Group Dining', desc: 'Accommodate intimate dinners to large group celebrations.' },
  { icon: FiStar, title: 'Premium Experience', desc: 'Every reservation comes with our signature hospitality guarantee.' },
];

const whyUs = [
  'Instant booking confirmation',
  'No reservation fees',
  'Easy cancellation policy',
  'Dedicated table assignment',
  'Special occasion support',
  'Real-time availability',
];

const testimonials = [
  { name: 'Sarah L.', text: 'The online reservation was seamless. The table was ready exactly as booked. Absolutely loved the experience!', rating: 5 },
  { name: 'James M.', text: 'Celebrated our anniversary here. The staff was attentive and the food was impeccable. Will definitely return.', rating: 5 },
  { name: 'Priya K.', text: 'I love how easy it is to book and manage reservations. Best dining experience in the city.', rating: 5 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();

  const reservePath = isAuthenticated
    ? (user?.role === 'customer' ? '/customer/reserve' : '/admin/dashboard')
    : '/register';

  const dashboardPath = isAuthenticated
    ? (user?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard')
    : '/login';

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 pt-24">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Restaurant"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold tracking-wider uppercase mb-6 border border-brand-500/30">
              Fine Dining Experience
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Where Every Meal<br />
              <span className="text-brand-400">Becomes a Memory</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Reserve your table at TableMaestro and indulge in an unforgettable culinary journey crafted with passion and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={reservePath} className="btn-primary text-lg px-8 py-4 flex items-center gap-2 justify-center">
                Reserve a Table <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link to={dashboardPath} className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all duration-200 backdrop-blur-sm">
                {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[['500+', 'Tables Booked'], ['4.9', 'Rating'], ['200+', 'Happy Guests']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-serif font-bold text-brand-400">{num}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Restaurant Introduction */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="text-brand-500 text-sm font-semibold tracking-wider uppercase">Our Story</span>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mt-2 mb-5">A Culinary Journey Like No Other</h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                Founded in 2012, TableMaestro has been synonymous with excellence in fine dining. Our chefs source the finest seasonal ingredients to craft dishes that celebrate both tradition and innovation.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Whether you're celebrating a milestone or enjoying a quiet dinner, our team is dedicated to making every visit exceptional. Our elegant setting, curated wine list, and warm hospitality set us apart.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['bg-brand-400', 'bg-sage-400', 'bg-amber-400', 'bg-blue-400'].map((c, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500"><span className="font-semibold text-gray-800">200+</span> happy diners this month</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="relative">
              <div className="rounded-3xl overflow-hidden shadow-modal">
                <img src="https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Restaurant interior" className="w-full h-[480px] object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card-hover p-5">
                <p className="text-4xl font-serif font-bold text-brand-500">12+</p>
                <p className="text-sm text-gray-500 mt-0.5">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-cream-100/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-brand-500 text-sm font-semibold tracking-wider uppercase">Why TableMaestro</span>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mt-2">The Complete Dining Experience</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">From reservation to dessert, every detail is handled with care.</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={item} className="card card-hover text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-brand-500" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Food" className="rounded-2xl h-48 w-full object-cover" />
                <img src="https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Wine" className="rounded-2xl h-48 w-full object-cover mt-8" />
                <img src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Interior" className="rounded-2xl h-48 w-full object-cover" />
                <img src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Dessert" className="rounded-2xl h-48 w-full object-cover mt-8" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="order-1 lg:order-2">
              <span className="text-brand-500 text-sm font-semibold tracking-wider uppercase">Our Promise</span>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mt-2 mb-6">Why Guests Choose Us</h2>
              <ul className="space-y-3 mb-8">
                {whyUs.map(point => (
                  <li key={point} className="flex items-center gap-3 text-gray-600">
                    <FiCheckCircle className="w-5 h-5 text-sage-500 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link to={reservePath} className="btn-primary inline-flex items-center gap-2">
                Start Reserving <FiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-brand-400 text-sm font-semibold tracking-wider uppercase">Testimonials</span>
            <h2 className="text-4xl font-serif font-bold text-white mt-2">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FiStar key={j} className="w-4 h-4 text-brand-400 fill-brand-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">{t.name.charAt(0)}</div>
                  <span className="font-medium text-white text-sm">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-500">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Ready for an Unforgettable Evening?</h2>
            <p className="text-brand-100 text-lg mb-8">Secure your table today and let us take care of the rest.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={reservePath} className="bg-white text-brand-600 hover:bg-brand-50 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg inline-flex items-center gap-2 justify-center">
                Reserve Now <FiArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+15551234567" className="bg-brand-600/40 hover:bg-brand-600/60 text-white font-semibold px-8 py-4 rounded-xl border border-white/30 transition-all duration-200 inline-flex items-center gap-2 justify-center">
                <FiPhone className="w-5 h-5" /> Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
