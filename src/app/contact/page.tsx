// 'use client';

// import { useState, FormEvent } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import Link from 'next/link';
// import toast from 'react-hot-toast';

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { LoadingSpinner } from '@/components/common/LoadingSpinner';
// import { Mail, Phone, MapPin } from 'lucide-react';

// export default function ContactPage() {
//     const { user } = useAuth();

//     const [queryType, setQueryType] = useState<'General' | 'Order Related'>('General');
//     const [orderId, setOrderId] = useState('');
//     const [message, setMessage] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();
//         if (!user) {
//             toast.error("You must be logged in to submit a query.");
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const response = await fetch('/api/contact', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     queryType,
//                     orderId: queryType === 'Order Related' ? orderId : undefined,
//                     message,
//                 }),
//             });
            
//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(data.error || 'Failed to send message.');
//             }

//             toast.success(data.message);
//             // Reset form
//             setQueryType('General');
//             setOrderId('');
//             setMessage('');

//         } catch (error: any) {
//             toast.error(error.message);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-16">
//             <div className="text-center mb-12">
//                 <h1 className="text-4xl font-extrabold tracking-tight">Get In Touch</h1>
//                 <p className="mt-2 text-lg text-muted-foreground">We'd love to hear from you! Reach out with any questions or feedback.</p>
//             </div>

//             <div className="grid md:grid-cols-2 gap-12">
//                 {/* Left side: Contact Info */}
//                 <div className="space-y-8">
//                     <h2 className="text-2xl font-bold">Contact Information</h2>
//                     <div className="flex items-start gap-4">
//                         <MapPin className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
//                         <div>
//                             <h3 className="font-semibold">Our Studio</h3>
//                             <p className="text-muted-foreground">123 Creative Lane, Pune, Maharashtra, 411001, India</p>
//                         </div>
//                     </div>
//                     <div className="flex items-start gap-4">
//                         <Mail className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
//                         <div>
//                             <h3 className="font-semibold">Email Us</h3>
//                             <p className="text-muted-foreground">hello@glowgirlapparel.com</p>
//                         </div>
//                     </div>
//                      <div className="flex items-start gap-4">
//                         <Phone className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
//                         <div>
//                             <h3 className="font-semibold">Call Us</h3>
//                             <p className="text-muted-foreground">(+91) 987 654 3210</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right side: Contact Form */}
//                 <div>
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Send a Message</CardTitle>
//                             <CardDescription>
//                                 {user ? 'Fill out the form below and we will get back to you.' : 'Please log in to send us a message.'}
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             {!user ? (
//                                 <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
//                                     <p className="text-muted-foreground mb-4">You need an account to send a message.</p>
//                                     <Button asChild>
//                                         <Link href="/login">Login to Continue</Link>
//                                     </Button>
//                                 </div>
//                             ) : (
//                                 <form onSubmit={handleSubmit} className="space-y-6">
//                                     <div>
//                                         <Label className="mb-2 block">What is your query about?</Label>
//                                         <RadioGroup value={queryType} onValueChange={(value: 'General' | 'Order Related') => setQueryType(value)} className="flex gap-4">
//                                             <div className="flex items-center space-x-2">
//                                                 <RadioGroupItem value="General" id="r1" />
//                                                 <Label htmlFor="r1">General</Label>
//                                             </div>
//                                             <div className="flex items-center space-x-2">
//                                                 <RadioGroupItem value="Order Related" id="r2" />
//                                                 <Label htmlFor="r2">Order Related</Label>
//                                             </div>
//                                         </RadioGroup>
//                                     </div>

//                                     {queryType === 'Order Related' && (
//                                         <div className="space-y-2">
//                                             <Label htmlFor="orderId">Order ID</Label>
//                                             <Input id="orderId" placeholder="e.g., 60c72b2f9b1e8a001f8e4caa" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
//                                         </div>
//                                     )}

//                                     <div className="space-y-2">
//                                         <Label htmlFor="message">Your Message</Label>
//                                         <Textarea id="message" placeholder="Tell us how we can help..." className="min-h-[120px]" value={message} onChange={(e) => setMessage(e.target.value)} required />
//                                     </div>
                                    
//                                     <Button type="submit" className="w-full" disabled={isSubmitting}>
//                                         {isSubmitting ? <LoadingSpinner size="sm" /> : 'Send Message'}
//                                     </Button>
//                                 </form>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MessageSquare, Package, Truck, CircleHelp } from 'lucide-react';

export default function ContactPage() {
    const { user } = useAuth();

    const [queryType, setQueryType] = useState<'General' | 'Order Related'>('General');
    const [orderId, setOrderId] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("You must be logged in to submit a query.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    queryType,
                    orderId: queryType === 'Order Related' ? orderId : undefined,
                    message,
                }),
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send message.');

            toast.success(data.message);
            setQueryType('General');
            setOrderId('');
            setMessage('');

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-pink-50 dark:bg-gray-900/50 py-20 md:py-28">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight"
                    >
                        We're Here to Help
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
                    >
                        Have a question, comment, or concern? Our team is ready to assist you.
                    </motion.p>
                </div>
            </section>
            
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Illustration & Info */}
                    <div className="space-y-8 lg:sticky lg:top-24">
                        <motion.div
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ duration: 0.5, delay: 0.2 }}
                        >
                                                    </motion.div>
                        <h2 className="text-3xl font-bold">Let's Get in Touch</h2>
                        <p className="text-muted-foreground">
                            Fill out the form, and we'll get back to you as soon as possible. For immediate assistance, you can also reach us via email or phone.
                        </p>
                        <div className="space-y-4">
                             <div className="flex items-center gap-4">
                                <Mail className="h-6 w-6 text-pink-500 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Email Us</h3>
                                    <p className="text-muted-foreground">hello@glowgirlapparel.com</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <Phone className="h-6 w-6 text-pink-500 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Call Us</h3>
                                    <p className="text-muted-foreground">(+91) 987 654 3210</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div>
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Send a Message</CardTitle>
                                <CardDescription>
                                    {user ? 'Fill out the form below to reach our team.' : 'Please log in to send us a message.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!user ? (
                                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg p-4 text-center">
                                        <p className="text-muted-foreground mb-4">You need an account to send a message.</p>
                                        <Button asChild>
                                            <Link href="/login">Login to Continue</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <Label className="mb-3 block font-semibold">What is your query about?</Label>
                                            <RadioGroup value={queryType} onValueChange={(value: 'General' | 'Order Related') => setQueryType(value)} className="grid grid-cols-2 gap-4">
                                                <Label htmlFor="r1" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer has-[:checked]:border-primary">
                                                    <RadioGroupItem value="General" id="r1" className="sr-only" />
                                                    <MessageSquare className="mb-3 h-6 w-6" />
                                                    General
                                                </Label>
                                                <Label htmlFor="r2" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer has-[:checked]:border-primary">
                                                    <RadioGroupItem value="Order Related" id="r2" className="sr-only" />
                                                    <Package className="mb-3 h-6 w-6" />
                                                    Order Related
                                                </Label>
                                            </RadioGroup>
                                        </div>

                                        {queryType === 'Order Related' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 overflow-hidden">
                                                <Label htmlFor="orderId">Order ID</Label>
                                                <Input id="orderId" placeholder="e.g., 60c72b2f9b1e8a001f8e4caa" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
                                            </motion.div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Your Message</Label>
                                            <Textarea id="message" placeholder="Tell us how we can help..." className="min-h-[120px]" value={message} onChange={(e) => setMessage(e.target.value)} required />
                                        </div>
                                        
                                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                            {isSubmitting ? <LoadingSpinner size="sm" /> : 'Send Message'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

             {/* FAQ Section */}
            <section className="bg-muted/60 mt-16 py-16">
                <div className="container mx-auto px-4">
                     <div className="max-w-3xl mx-auto text-center mb-12">
                         <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                         <p className="mt-2 text-muted-foreground">Find quick answers to common questions below.</p>
                     </div>
                    <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How do I track my order?</AccordionTrigger>
                            <AccordionContent>
                                Once your order is shipped, you will receive an email with a tracking number and a link to the courier's website. You can also find the tracking information in the "My Orders" section of your profile.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>What is your return policy?</AccordionTrigger>
                            <AccordionContent>
                                We accept returns within 15 days of delivery for any unworn, unwashed items. Unfortunately, we cannot accept returns for custom-printed items unless there is a manufacturing defect.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>How long does custom printing take?</AccordionTrigger>
                            <AccordionContent>
                                Custom print orders typically take 3-5 business days for production before they are shipped. We'll notify you as soon as your custom creation is on its way!
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
        </div>
    );
}
