import React from 'react';

const styles = {
  footer: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1000,
    boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
  },
  text: {
    color: '#666',
    fontSize: '0.9rem',
    margin: 0
  }
};

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2024 Tripon. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
