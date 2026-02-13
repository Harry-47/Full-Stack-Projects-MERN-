// src/pages/User/FAQPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/SearchBar'; 
import Footer from '../../../components/Footer';

const faqs = [
    {
        question: "How do I place an order?",
        answer: "To place an order, simply browse our products, add your desired items to the cart, and proceed to checkout. Fill in your shipping details and complete the payment process.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit and debit cards, as well as several other payment options which will be displayed during the checkout process.",
    },
    {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive a tracking number via email. You can use this number on our website's 'Track Order' page to see the real-time status of your delivery.",
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for any products that are damaged or not as described. Please visit our 'Returns' page for more detailed information.",
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we do. International shipping costs and delivery times vary depending on the destination. You can find more details at checkout.",
    },
];

// Animation variants for staggered list
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // Items will appear one after another
        },
    },
};

// Animation variants for each individual FAQ item
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white poppins-regular">
            <Navbar user={{ isLoggedIn: true }} />
            
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex-grow container mx-auto px-4 py-12 md:py-20"
            >
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        className="text-center mb-12 md:mb-16"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Got a question? We've got the answers. If you can't find what you're looking for, feel free to contact us.
                        </p>
                    </motion.div>

                    {/* FAQ Accordion Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="bg-gray-100 rounded-3xl shadow-xl overflow-hidden p-2 md:p-4"
                    >
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white rounded-2xl mb-2 last:mb-0"
                            >
                                <motion.button
                                    className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                                    onClick={() => toggleAccordion(index)}
                                    whileHover={{ backgroundColor: '#f5f5f5' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span className="font-bold text-lg text-gray-800">{faq.question}</span>
                                    <motion.span
                                        initial={false}
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <FaChevronDown className="text-gray-500" />
                                    </motion.span>
                                </motion.button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="px-6 pb-6 text-gray-600"
                                        >
                                            <p>{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    {/* CTA Section */}
                    <div className="text-center mt-12 md:mt-16">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <Link
                                to="/user/products"
                                className="inline-block px-8 py-4 bg-black text-white font-semibold rounded-4xl shadow-md hover:bg-gray-800 transition-colors duration-300"
                            >
                                Continue Shopping
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.main>
            
            <Footer />
        </div>
    );
};

export default FAQPage;