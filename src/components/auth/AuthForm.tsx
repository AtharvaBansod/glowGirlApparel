// 'use client';

// import Link from 'next/link';
// import { FormEvent } from 'react';

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// // Defines the structure for each form field
// interface FormField {
//     id: string;
//     label: string;
//     type: 'text' | 'email' | 'password' | 'tel';
//     placeholder?: string;
//     required?: boolean;
// }

// // Defines the props the component accepts
// interface AuthFormProps {
//     title: string;
//     description: string;
//     fields: FormField[];
//     formData: Record<string, string>;
//     onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     onSubmit: (e: FormEvent) => void;
//     isLoading: boolean;
//     submitButtonText: string;
//     footerText: string;
//     footerLinkHref: string;
//     footerLinkText: string;
// }

// export default function AuthForm({
//     title,
//     description,
//     fields,
//     formData,
//     onFormChange,
//     onSubmit,
//     isLoading,
//     submitButtonText,
//     footerText,
//     footerLinkHref,
//     footerLinkText,
// }: AuthFormProps) {
//     return (
//         <div className="container flex items-center justify-center min-h-[80vh] px-4 py-8">
//             <Card className="w-full max-w-md">
//                 <CardHeader className="text-center">
//                     <CardTitle className="text-2xl">{title}</CardTitle>
//                     <CardDescription>{description}</CardDescription>
//                 </CardHeader>
//                 <form onSubmit={onSubmit}>
//                     <CardContent className="space-y-4">
//                         {fields.map((field) => (
//                             <div key={field.id} className="space-y-2">
//                                 <Label htmlFor={field.id}>{field.label}</Label>
//                                 <Input
//                                     id={field.id}
//                                     name={field.id}
//                                     type={field.type}
//                                     placeholder={field.placeholder}
//                                     value={formData[field.id] || ''}
//                                     onChange={onFormChange}
//                                     required={field.required !== false} // required by default
//                                     disabled={isLoading}
//                                 />
//                             </div>
//                         ))}
//                     </CardContent>
//                     <CardFooter className="flex flex-col gap-4">
//                         <Button type="submit" className="w-full" disabled={isLoading}>
//                             {isLoading ? <LoadingSpinner size="sm" /> : submitButtonText}
//                         </Button>
//                         <p className="text-sm text-center text-muted-foreground">
//                             {footerText}{" "}
//                             <Link href={footerLinkHref} className="font-medium text-primary hover:underline">
//                                 {footerLinkText}
//                             </Link>
//                         </p>
//                     </CardFooter>
//                 </form>
//             </Card>
//         </div>
//     );
// }