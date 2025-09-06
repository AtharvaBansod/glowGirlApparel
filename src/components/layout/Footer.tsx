import Link from 'next/link';
import { ShoppingBag, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted/60 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <ShoppingBag className="h-6 w-6 text-pink-500" />
                            <span className="font-bold text-lg text-foreground">Glow Girl Apparel</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Wear Your Story. High-quality custom and curated apparel to express your unique style.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
                            <li><Link href="/custom-print" className="text-muted-foreground hover:text-primary">Custom Print</Link></li>
                            <li><Link href="/#products" className="text-muted-foreground hover:text-primary">Shop Collection</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Follow Us</h4>
                        <div className="flex items-center gap-4">
                            <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                                <Facebook className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {currentYear} Glow Girl Apparel. All Rights Reserved. Made with ❤️ in Pune, India.</p>
                </div>
            </div>
        </footer>
    );
};