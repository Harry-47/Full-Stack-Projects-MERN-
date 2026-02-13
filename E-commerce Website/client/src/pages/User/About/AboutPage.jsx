import { motion } from 'framer-motion';
import Navbar from '../../../components/SearchBar';
import Footer from '../../../components/Footer';
import AboutHero from './components/AboutHero';
import MissionVision from './components/MissionVision';
import CoreValues from './components/CoreValues';
import TeamCarousel from './components/TeamMembers';
import AboutCTA from './components/AboutCTA';

const AboutPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 poppins-regular">
            <motion.main
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-grow"
            >
                <AboutHero />
                <MissionVision />
                <CoreValues />
                <TeamCarousel />
                <AboutCTA />
                
                {/* Extra content to make the page longer */}
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Our Journey So Far</h2>
                    <p className="text-lg text-gray-600 text-center mb-10">
                        From a small idea to a thriving community, Harryesthetics has been on a relentless quest to bring aesthetic and high-quality products to people's lives. We started with a simple goal: to make beauty accessible.
                    </p>
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl shadow-lg w-full md:w-1/2"
                        >
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">2020: The Beginning</h3>
                            <p className="text-gray-600">
                                Founded in a small dorm room, we launched our first collection of minimalist designs. The response was overwhelming, confirming our belief that people crave simplicity and elegance.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl shadow-lg w-full md:w-1/2"
                        >
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">2023: Expansion</h3>
                            <p className="text-gray-600">
                                We expanded our product range to include home decor and accessories, reaching new customers globally. Our commitment to sustainable practices also became a core part of our brand identity.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </motion.main>

            <Footer />
        </div>
    );
};

export default AboutPage;