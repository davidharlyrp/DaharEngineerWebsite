import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';

export default function OnlineCourses() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 lg:px-20 bg-background flex flex-col items-center justify-center">
            <SEO
                title="Online Courses - Dahar Engineer"
                description="Our online courses are currently under maintenance. Please check back later for updates on our engineering courses."
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center p-8 bg-secondary/5 border border-border/10 rounded-md flex flex-col items-center gap-4"
            >
                <div className="w-12 h-12 bg-army-700/10 flex items-center justify-center rounded-sm text-army-400">
                    <Wrench className="w-5 h-5" />
                </div>

                <div>
                    <h1 className="text-xl font-semibold mb-2">Online Courses</h1>
                    <p className="text-sm text-muted-foreground opacity-90 leading-relaxed">
                        This page is currently under maintenance. We are working hard to bring you the best learning experience. Please check back later.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
