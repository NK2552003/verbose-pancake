import ContactForm from "./contact-form"

export default function ContactSection() {

  
  return (
    <section id="contact" className=" relative py-16 sm:py-20 bg-[#031412] z-10">
                <div className="mb-10 text-center" >
            <h2 className="text-3xl md:text-5xl font-bold text-white">Contact Me</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground max-w-3xl mx-auto text-white/80 mb-20">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>
          </div>
          <div className="w-full">
            <ContactForm />
          </div>
    </section>
  )
}

