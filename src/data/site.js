export const site = {
  name: "AV Graphics Art",
  owner: "Anand Prakash Nimwal",
  city: "Delhi",
  address: "Delhi, India",
  phones: [
    { label: "78389 89931", raw: "7838989931", tel: "+917838989931" },
    { label: "99994 79983", raw: "9999479983", tel: "+919999479983" },
  ],
  whatsapp: "917838989931",
  whatsappMessage: "Hi AV Graphics Art, I would like a custom quote.",
  email: "avgraphicsart16@gmail.com",
  instagram: "@avgraphicsart",
  instagramUrl: "https://www.instagram.com/avgraphicsart/?hl=en",
  facebook: "Facebook",
  facebookUrl: "https://www.facebook.com/profile.php?id=61594267629208",
  hours: "Monday – Saturday, 10:00 AM – 7:00 PM",
  hoursNote: "Sunday by appointment",
  mapEmbed:
    "https://maps.google.com/maps?q=Delhi%2C%20India&t=&z=11&ie=UTF8&iwloc=&output=embed",
};

export const whatsappUrl = (text = site.whatsappMessage) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const categories = ["LED Light Boards", "Nameplates", "Neon Plates"];

export const serviceGroups = [
  "Signage & Boards",
  "Printing & Branding",
  "Events & Corporate",
  "Services",
];
