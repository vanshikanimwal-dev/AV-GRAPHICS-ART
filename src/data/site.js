export const site = {
  name: "AV Graphics Art",
  url: "https://av-graphics-art.onrender.com",
  owner: "Anand Prakash Nimwal",
  city: "Delhi",
  address: "J-101, Budh Bazar Road, Block 8, Geeta Colony, Delhi 110031",
  mapsUrl: "https://maps.app.goo.gl/taKZbkrkhq4iafRH6",
  mapEmbed:
    "https://maps.google.com/maps?q=28.656038,77.2704516&z=17&hl=en&output=embed",
  geo: { lat: 28.656038, lng: 77.2704516 },
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

export const categoriesByGroup = {
  Boards: ["Crystal Board", "ACP Board", "Sparkle Board", "Glow Sign Board", "LED Board"],
  "Letters & Plates": ["Acrylic Plates", "Plastic Letter", "Steel Letter", "Name Plate"],
  "Display & Print": ["Moving Display", "Standee", "Digital Prints"],
};

export const categories = Object.values(categoriesByGroup).flat();

export const serviceGroups = ["Boards", "Letters & Plates", "Display & Print"];

export const workTypesCopy =
  "crystal board, ACP board, sparkle board, glow sign board, LED board, acrylic plates, plastic letter, steel letter, moving display, name plate, standee and digital prints";
