import React from 'react';
import { motion } from 'framer-motion';     //npm install framer-motion
import './HomePage.css';
 
 
const HomePage = () => {
  return (
    <div className="background-video">
      <video autoPlay loop muted className="video-background">
        <source src="/travel2.mp4" type="video/mp4" />
      </video>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={{
          initial: { opacity: 0, y: 50 },
          in: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          out: { opacity: 0, y: -50, transition: { duration: 0.5 } },
        }}
        className="content">
        <nav role="navigation">
          <div className="title">Travel Tales</div>
          <div className="description">
            Discover, create, and share unique travel experiences with a community of fellow enthusiasts.
          </div>
        </nav>
        <div className="contact">
          <p className='info'>Contact Us</p>
          <p  className='info'>Email: example@example.com</p>
          <p  className='info'>Phone: 123-456-7890</p>
        </div>
      </motion.div>
    </div>
  );
};
 
export default HomePage;    









