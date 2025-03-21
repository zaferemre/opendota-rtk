import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Menu, X } from "lucide-react";
import { FaInstagram, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  background-color: ${({ isScrolled }) =>
    isScrolled ? "white" : "transparent"};
  box-shadow: ${({ isScrolled }) =>
    isScrolled ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none"};
`;

const ContentContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: black;
`;

const DesktopNav = styled.nav`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    gap: 24px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  color: ${({ variant }) => (variant === "green" ? "#EFBF04" : "#555")};
  &:hover {
    color: black;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
  @media (min-width: 768px) {
    display: none;
  }
  &:hover {
    color: black;
  }
`;

const DesktopButton = styled.a`
  display: none;
  @media (min-width: 768px) {
    display: inline-block;
  }
  background-color: #efbf04;
  color: white;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 9999px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const MobileDropdown = styled.div`
  position: absolute;
  top: 64px;
  right: 16px;
  width: 192px;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 768px) {
    display: none;
  }
`;

const DropdownLink = styled.a`
  text-decoration: none;
  color: #555;
  transition: color 0.3s ease;
  &:hover {
    color: black;
  }
`;

const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
`;

const SocialIconLink = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #acf48c;
  color: black;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HeaderContainer isScrolled={isScrolled}>
      <ContentContainer>
        <Logo>more.dota</Logo>
        <DesktopNav>
          <NavLink href="/" variant="green">
            Ana Sayfa
          </NavLink>
          <NavLink href="/profile">Profile</NavLink>
          <NavLink href="/match">Match</NavLink>
        </DesktopNav>
        <MobileMenuButton onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </MobileMenuButton>
        <DesktopButton
          href="https://api.whatsapp.com/send/?phone=905464213365&text&type=phone_number&app_absent=0&wame_ctl=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bize Yazın
        </DesktopButton>
      </ContentContainer>
      {menuOpen && (
        <MobileDropdown>
          <DropdownLink href="#">Ana Sayfa</DropdownLink>
          <DropdownLink href="/hakkimizda">Hakkımızda</DropdownLink>
          <DropdownLink href="#">ChiroBlog</DropdownLink>
          <SocialMediaContainer>
            {[
              {
                icon: <FaMapMarkerAlt />,
                link: "https://maps.app.goo.gl/QPVLSz9qFz84aYZeA?g_st=iw",
              },
              {
                icon: <FaInstagram />,
                link: "https://www.instagram.com/chirocare.kadikoy/#",
              },
              { icon: <FaPhone />, link: "tel:05464213365" },
            ].map((item, index) => (
              <SocialIconLink
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.icon}
              </SocialIconLink>
            ))}
          </SocialMediaContainer>
        </MobileDropdown>
      )}
    </HeaderContainer>
  );
}
