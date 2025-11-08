import './LandingPage.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand">SmartBus</div>
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:support@smartbus.com">support@smartbus.com</a></li>
              <li><a href="tel:+250700000000">+250 700 000 000</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#" aria-label="Privacy Policy">Privacy Policy</a></li>
              <li><a href="#" aria-label="Terms of Service">Terms of Service</a></li>
              <li><a href="#" aria-label="Cookie Policy">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="copy">© {new Date().getFullYear()} SmartBus. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
