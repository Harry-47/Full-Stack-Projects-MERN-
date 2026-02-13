
import { motion } from 'framer-motion';
import Navbar from '../../../components/SearchBar';
import Footer from '../../../components/Footer';
import ContactHero from './components/ContactHero';
import ContactFormSection from './components/ContactFormSection';
import ContactInfo from './components/ContactInfo';


const ContactPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white poppins-regular">
            <Navbar user={{ isLoggedIn: true }} />
            
            <motion.main
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-grow"
            >
                <ContactHero />
                <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        <ContactFormSection />
                        <ContactInfo />
                    </div>
                </div>
            </motion.main>
            
            <Footer />
        </div>
    );
};

export default ContactPage;