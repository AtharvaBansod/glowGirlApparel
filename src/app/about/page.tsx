'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Paintbrush, Shirt, Package, Sparkles } from 'lucide-react';

// Animation variants for Framer Motion
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

export default function AboutPage() {
    return (
        <div className="overflow-x-hidden">
            {/* Section 1: Hero */}
            <motion.section
                className="relative text-center py-20 md:py-32 bg-pink-50 dark:bg-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="container mx-auto px-4">
                    <motion.h1
                        className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        Wear Your Story.
                    </motion.h1>
                    <motion.p
                        className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        style={{ transitionDelay: '0.2s' }}
                    >
                        At <span className="font-bold text-pink-500">Glow Girl Apparel</span>, we believe your clothing should be as unique as you are. We turn high-quality apparel into a canvas for your creativity.
                    </motion.p>
                </div>
            </motion.section>

            {/* Section 2: Our Story */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Our Creative Spark</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Founded from a passion for self-expression, Glow Girl Apparel started in a small studio with a big dream: to make custom apparel accessible, easy, and exciting for everyone. We got tired of generic, mass-produced fashion and wanted to empower individuals to wear what they love, designed by them. Today, we're a vibrant community of creators, bringing thousands of unique ideas to life every day.
                        </p>
                    </motion.div>
                    <motion.div
                        className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Image src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070" alt="T-shirts on a rack" layout="fill" objectFit="cover" />
                    </motion.div>
                </div>
            </section>

            {/* Section 3: What We Do */}
            <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-12">The Glow Girl Difference</h2>
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { icon: Shirt, title: 'Premium Apparel', desc: 'We source only the softest, most durable tees, hoodies, and more.' },
                            { icon: Paintbrush, title: 'Vibrant Prints', desc: 'Our state-of-the-art printing ensures your designs are sharp and long-lasting.' },
                            { icon: Sparkles, title: 'Unleash Creativity', desc: 'Our easy-to-use design tool makes bringing your vision to life a breeze.' },
                            { icon: Package, title: 'Fast & Careful Shipping', desc: 'We pack every order with love and get it to you as quickly as possible.' },
                        ].map(item => (
                            <motion.div key={item.title} variants={fadeInUp} className="flex flex-col items-center">
                                <div className="bg-pink-500 text-white rounded-full p-4 mb-4">
                                    <item.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section 4: Call to Action */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 text-center">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.7 }}
                    >
                        Ready to Create Something Amazing?
                    </motion.h2>
                    <motion.p
                        className="max-w-xl mx-auto text-muted-foreground mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        Explore our curated collection or jump right in and design your own masterpiece.
                    </motion.p>
                    <motion.div
                        className="flex justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <Button asChild size="lg">
                            <Link href="/custom-print">Start a Custom Print</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/">Shop Collection</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}