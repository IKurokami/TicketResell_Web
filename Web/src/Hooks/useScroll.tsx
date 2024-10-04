import { useEffect, useState } from "react";

export const useScroll = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsScrolled(scrollPosition > 10);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return isScrolled;
};
