import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Toast from '../components/common/Toast';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setToast({ message: "Your message has been sent! We'll get back to you shortly.", type: 'success' });
            setName('');
            setEmail('');
            setMessage('');
        }, 1000);
    };

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                            Contact Us
                        </h1>
                        <p className="mt-4 text-xl text-slate-600">
                            Have questions or feedback? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="mt-12">
                        <Card>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                                    <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                                    <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
                                </div>
                                <div className="text-right">
                                    <Button type="submit" isLoading={isLoading}>
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactPage;
