const Contact = () => (
  <div className="page narrow">
    <h1>Contact</h1>
    <p>
      TodoStack is a demo productivity experience. For questions, suggestions or feedback please
      reach out using the details below.
    </p>
    <ul className="contact-details">
      <li>
        <strong>Email:</strong>{' '}
        <a href="mailto:support@todostack.local">support@todostack.local</a>
      </li>
      <li>
        <strong>Phone:</strong> +49 000 000 000
      </li>
      <li>
        <strong>Address:</strong> Productivity Street 1, 10115 Berlin, Germany
      </li>
    </ul>
    <p>
      We aim to respond to all enquiries within two working days. Premium support is prioritised for
      paying members.
    </p>
  </div>
);

export default Contact;
