import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "Thank you for reaching out." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-2 font-rajdhani text-sm font-semibold uppercase tracking-widest text-primary">
            Get In Touch
          </h2>
          <h3 className="font-rajdhani text-3xl font-bold text-foreground md:text-4xl">
            Contact Me
          </h3>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-xl p-6 space-y-4"
          >
            <Input
              placeholder="Your Name"
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-background/50 border-border font-cairo"
            />
            <Input
              type="email"
              placeholder="Your Email"
              maxLength={255}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-background/50 border-border font-cairo"
            />
            <Textarea
              placeholder="Your Message"
              maxLength={1000}
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="bg-background/50 border-border font-cairo"
            />
            <Button type="submit" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </motion.form>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-6"
          >
            <a href="mailto:yousefmahmoudsaber@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-cairo text-sm">
              <Mail className="h-5 w-5 text-primary" />
              yousefmahmoudsaber@gmail.com
            </a>
            <a href="tel:+201097585951" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-cairo text-sm">
              <Phone className="h-5 w-5 text-primary" />
              +20 109 758 5951
            </a>
            <div className="flex items-center gap-3 text-muted-foreground font-cairo text-sm">
              <MapPin className="h-5 w-5 text-primary" />
              Egypt, 10th of Ramadan City, Andalus District
            </div>

            <div className="flex gap-4 pt-4">
              <a href="https://linkedin.com/in/kingman-jou" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://github.com/kingman8888" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://t.me/SmartAnswerAi_bot" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Send className="h-6 w-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 border-t border-border pt-8 text-center">
        <p className="font-cairo text-sm text-muted-foreground">
          © 2026 Youssef AlSherief. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Contact;
