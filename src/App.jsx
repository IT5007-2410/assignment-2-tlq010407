/*Q1. JS Variable needs to be created here. Below variable is just an example. Try to add more attributes.*/
const initialTravellers = [
  {
    id: 1, name: 'Jack', 
    phone: 88885555,
    bookingTime: new Date(),
    seatNumber: 'A1', 
  },
  {
    id: 2, name: 'Rose', 
    phone: 88884444,
    bookingTime: new Date(),
    seatNumber: 'A2', 
  },
];

// TravellerRow Component
function TravellerRow(props) {
  {/*Q3. Placeholder to initialize local variable based on traveller prop.*/}
  const traveller = props.traveller;
  return (
  /*Q3. Placeholder for rendering one row of a table with required traveller attribute values.*/
    <tr>
      <td>{traveller.id}</td>
      <td>{traveller.name}</td>
      <td>{traveller.phone}</td>
      <td>{traveller.bookingTime.toLocaleString()}</td>
      <td>{traveller.seatNumber}</td>
    </tr>
  );
}

// Display Component
function Display(props) {
/*Q3. Write code to render rows of table, reach corresponding to one traveller. Make use of the TravellerRow function that draws one row.*/
const travellerRows = props.travellers.map(traveller => <TravellerRow key={traveller.id} traveller={traveller} />);
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          {/*Q3. Below table is just an example. Add more columns based on the traveller attributes you choose.*/}
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Booking Time</th>
          <th>Seat Number</th>
        </tr>
      </thead>
      <tbody>
         {/*Q3. write code to call the JS variable defined at the top of this function to render table rows.*/}
         {travellerRows}
      </tbody>
    </table>
  );
}

// Add Component
class Add extends React.Component {
  constructor() {
    super();
    // Initialize state for form fields
    this.state = {
      travellername: '',
      phone: '',
      seatNumber: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // Handle input changes to update state
  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    /*Q4. Fetch the passenger details from the add form and call bookTraveller()*/
    // Fetch the passenger details from the form and call bookTraveller()
    const { travellername, phone, seatNumber } = this.state;

    // Create a traveller object
    const traveller = {
      id: this.props.travellers.length + 1, // Create a unique ID
      name: travellername,
      phone: phone,
      bookingTime: new Date(), // Capture the booking time as the current date
      seatNumber: seatNumber,
    };

    // Call bookTraveller method from the parent component (pass traveller object)
    this.props.bookTraveller(traveller);

    // Clear the form fields by resetting state
    this.setState({
      travellername: '',
      phone: '',
      seatNumber: '',
    });
  }

  render() {
    return (
      <form name="addTraveller" onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="travellername"
          placeholder="Name"
          value={this.state.travellername}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={this.state.phone}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="text"
          name="seatNumber"
          placeholder="Seat"
          value={this.state.seatNumber}
          onChange={this.handleInputChange}
          required
        />
        <button type="submit">Add</button>
      </form>
    );
  }
}

// Delete Component
class Delete extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    /*Q5. Fetch the passenger details from the deletion form and call deleteTraveller()*/
    const form = document.forms.deleteTraveller;
    // Call deleteTraveller method from parent component (passenger name)
    const name = form.travellername.value;
    this.props.deleteTraveller(name);
    // Clear the form field
    form.travellername.value = '';
  }

  render() {
    return (
      <form name="deleteTraveller" onSubmit={this.handleSubmit}>
         {/*Q5. Placeholder form to enter information on which passenger's ticket needs to be deleted. Below code is just an example.*/}
        <input type="text" name="travellername" placeholder="Name" required />
        <button>Delete</button>
      </form>
    );
  }
}

// Homepage Component with Seat Grid
class Homepage extends React.Component {
  render() {
    const totalSeats = 10;
    const occupiedSeats = this.props.travellers.map(t => t.seatNumber);

    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      const seat = `A${i}`;
      seats.push(
        <div key={seat} className={occupiedSeats.includes(seat) ? 'occupied-seat' : 'free-seat'}>
          {seat}
        </div>
      );
    }

    return (
      <div className="seating-grid">
        {seats}
      </div>
    );
  }
}

// Main TicketToRide Component
class TicketToRide extends React.Component {
  constructor() {
    super();
    this.state = { travellers: [], selector: 1 };
    this.bookTraveller = this.bookTraveller.bind(this);
    this.deleteTraveller = this.deleteTraveller.bind(this);
    this.setSelector = this.setSelector.bind(this);
  }

  setSelector(value) {
    /*Q2. Function to set the value of component selector variable based on user's button click.*/
    this.setState({ selector: value });
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      this.setState({ travellers: initialTravellers });
    }, 500);
  }

  bookTraveller(traveller) {
     /*Q4. Add a passenger to the traveller state variable.*/
    const newTravellers = [...this.state.travellers, traveller];
    this.setState({ travellers: newTravellers });
  }

  deleteTraveller(name) {
     /*Q5. Delete a passenger by name from the traveller state variable.*/
    const newTravellers = this.state.travellers.filter(traveller => traveller.name !== name);
    this.setState({ travellers: newTravellers });
  }

  render() {
    const { selector, travellers } = this.state;
    let content;

    if (selector === 1) content = <Homepage travellers={travellers} />;
    if (selector === 2) content = <Display travellers={travellers} />;
    if (selector === 3) content = <Add bookTraveller={this.bookTraveller} travellers={travellers} />;
    if (selector === 4) content = <Delete deleteTraveller={this.deleteTraveller} />;

    return (
      <div>
        <h1>Ticket To Ride</h1>
        <div>
          <button onClick={() => this.setSelector(1)}>Homepage</button>
          <button onClick={() => this.setSelector(2)}>View Travellers</button>
          <button onClick={() => this.setSelector(3)}>Add Traveller</button>
          <button onClick={() => this.setSelector(4)}>Delete Traveller</button>
        </div>
        <div>{content}</div>
      </div>
    );
  }
}

const element = <TicketToRide />;

ReactDOM.render(element, document.getElementById('contents'));