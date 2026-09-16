// Example usage
const images: string[] = [
  "https://zaplynimages.s3.eu-west-2.amazonaws.com/mango-app/admin-app-orange.webp",
  "https://zaplynimages.s3.eu-west-2.amazonaws.com/mango-app/admin-app-red.webp ",
  "https://zaplynimages.s3.eu-west-2.amazonaws.com/mango-app/admin-app-bright-light-blue.jpg ",
  "https://zaplynimages.s3.eu-west-2.amazonaws.com/mango-app/admin-app-light-blue.jpg ",
  "https://zaplynimages.s3.eu-west-2.amazonaws.com/mango-app/admin-app-pink-solid.jpg",
];

export function getRandomImage(): string {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}
