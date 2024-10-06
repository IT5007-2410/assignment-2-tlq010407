/*Q1. JS Variable needs to be created here. Below variable is just an example. Try to add more attributes.*/
const initialTravellers = [
  {
    id: 1, name: 'Jack',
    phone: 88885555,
    bookingTime: new Date(),
    travelDate: "2024-10-10",
    seatNumber: 'A1',
  },
  {
    id: 2, name: 'Rose',
    phone: 88884444,
    bookingTime: new Date(),
    travelDate: "2024-10-10",
    seatNumber: 'A2',
  },
];

// TravellerRow Component
function TravellerRow(props) {
  {/*Q3. Placeholder to initialize local variable based on traveller prop.*/ }
  const traveller = props.traveller;
  return (
    /*Q3. Placeholder for rendering one row of a table with required traveller attribute values.*/
    <tr>
      <td>{traveller.id}</td>
      <td>{traveller.name}</td>
      <td>{traveller.phone}</td>
      <td>{traveller.bookingTime.toLocaleString()}</td>
      <td>{traveller.travelDate}</td>
      <td>{traveller.seatNumber}</td>
    </tr>
  );
}

// Display Component
function Display(props) {
  /*Q3. Write code to render rows of table, reach corresponding to one traveller. Make use of the TravellerRow function that draws one row.*/
  // Map each traveller to a TravellerRow component
  const travellerRows = props.travellers.map(traveller => <TravellerRow key={traveller.id} traveller={traveller} />);
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          {/*Q3. Below table is just an example. Add more columns based on the traveller attributes you choose.*/}
          {/* Placeholder to render table header with required column names.*/}
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Booking Time</th>
          <th>Travel Date</th>
          <th>Seat Number</th>
        </tr>
      </thead>
      <tbody>
        {/*Q3. write code to call the JS variable defined at the top of this function to render table rows.*/}
        {/* Placeholder to render table rows with traveller data */}
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
      travelDate: '',
      errorMessage: '',  // Add an error message state
    };
    // Bind the event handlers
    this.handleSubmit = this.handleSubmit.bind(this);
    // Bind the event handler for input changes
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // Handle input changes to update state
  handleInputChange(e) {
    const { name, value } = e.target;
    // Update the state for all form fields
    this.setState({ [name]: value });
  }

  // Filter out occupied seats for the selected travel date
  getAvailableSeats() {
    const totalSeats = 10;
    const { travellers } = this.props;
    const { travelDate } = this.state;

    // Filter travellers by selected travel date
    const occupiedSeats = travellers
      .filter(traveller => traveller.travelDate === travelDate)
      .map(traveller => traveller.seatNumber);

    // Create an array of all seats (A1, A2, ..., A10)
    const allSeats = Array.from({ length: totalSeats }, (_, i) => `A${i + 1}`);

    // Filter out the occupied seats to get available seats
    return allSeats.filter(seat => !occupiedSeats.includes(seat));
  }

  handleSubmit(e) {
    e.preventDefault();
    /*Q4. Fetch the passenger details from the add form and call bookTraveller()*/
    // Fetch the passenger details from the form and call bookTraveller()
    const { travellername, phone, seatNumber, travelDate } = this.state;

    // Validate the name 
    const namePattern = /^[A-Za-z\s]+$/;  // Allows alphabetic characters and spaces
    if (!namePattern.test(travellername)) {
      this.setState({ errorMessage: 'Please enter only alphabetic characters in the name.' });
      return; // Stop form submission if validation fails
    }
    // Validate the phone number 
    const phonePattern = /^[0-9]{8}$/;  // Adjust the pattern based on your required format
    if (!phonePattern.test(phone)) {
      this.setState({ errorMessage: 'Please enter a valid 8-digit phone number.' });
      return; // Stop form submission if validation fails
    }

    // Create a traveller object
    const traveller = {
      id: this.props.travellers.length + 1, // Create a unique ID
      name: travellername,
      phone: phone,
      bookingTime: new Date(), // Capture the booking time as the current date
      travelDate: travelDate, // Capture the travel date as the current date
      seatNumber: seatNumber,
    };

    // Call bookTraveller method from the parent component (pass traveller object)
    this.props.bookTraveller(traveller);

    // Clear the form fields by resetting state
    this.setState({
      travellername: '',
      phone: '',
      travelDate: '',
      seatNumber: '',
      errorMessage: '', // Clear error message
    });
  }

  render() {
    const availableSeats = this.getAvailableSeats(); // Get available seats based on the selected travel date
    return (
      <form name="addTraveller" onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="travellername">Name: </label>
          <input
            type="text"
            name="travellername"
            id="travellername"
            placeholder="Name"
            value={this.state.travellername}
            onChange={this.handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone: </label>
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="Phone"
            value={this.state.phone}
            onChange={this.handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="travelDate">Travel Date: </label>
          <input
            type="date"
            name="travelDate"
            id="travelDate"
            placeholder="Travel Date"
            value={this.state.travelDate}
            onChange={this.handleInputChange}
            min={new Date().toISOString().split('T')[0]} // Ensures date from today onwards
            required
          />
        </div>

        <div>
          <label htmlFor="seatNumber">Seat: </label>
          <select
            name="seatNumber"
            id="seatNumber"
            value={this.state.seatNumber}
            onChange={this.handleInputChange}
            required
            disabled={!this.state.travelDate} // Disable if no date is selected
          >
            <option value="">Select a seat</option>
            {availableSeats.map(seat => (
              <option key={seat} value={seat}>
                {seat}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add</button>
        {/* Display error message if phone number is invalid */}
        {this.state.errorMessage && <p style={{ color: 'red' }}>{this.state.errorMessage}</p>}
      </form>
    );
  }
}

// Delete Component
class Delete extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: '', // Store an error message if the name is invalid
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.deleteTraveller;
    const name = form.travellername.value;

    // Check if the traveler exists
    const travelerExists = this.props.travellers.some(traveller => traveller.name === name);

    if (!travelerExists) {
      // If traveler does not exist, show an error message
      this.setState({ errorMessage: 'Invalid input: Traveler does not exist' });
      return;
    }

    // Show a confirmation popup if the traveler exists
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);

    if (confirmDelete) {
      // Call deleteTraveller method from parent component (passenger name)
      this.props.deleteTraveller(name);

      // Clear the form field
      form.travellername.value = '';
      this.setState({ errorMessage: '' }); // Clear error message after successful deletion
    }
  }

  render() {
    return (
      <div>
        <form name="deleteTraveller" onSubmit={this.handleSubmit}>
          {/* Input field for traveler name */}
          <input type="text" name="travellername" placeholder="Name" required />

          {/* Delete button */}
          <button type="submit">Delete</button>
        </form>

        {/* Show error message if invalid name */}
        {this.state.errorMessage && (
          <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
        )}
      </div>
    );
  }
}

// Homepage Component with Seat Grid
class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: "", // Default state for selected date
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(e) {
    this.setState({ selectedDate: e.target.value });
  }

  render() {
    const totalSeats = 10;
    const { travellers } = this.props;
    const { selectedDate } = this.state;

    // Filter travellers based on the selected travel date
    const filteredTravellers = travellers.filter(
      t => t.travelDate === selectedDate
    );

    // Get the seat numbers of the occupied seats
    const occupiedSeats = filteredTravellers.map(t => t.seatNumber);

    // Create an array of all seats
    const seats = [];
    // To count free seats
    let freeSeatCount = 0;
    // Loop through all seats and check if they are occupied
    for (let i = 1; i <= totalSeats; i++) {
      const seat = `A${i}`;
      const isOccupied = occupiedSeats.includes(seat);

      // Count free seats
      if (!isOccupied) freeSeatCount++;

      // Push the seat to the seats array without seat number, only the status
      seats.push(
        <div
          key={seat}
          className={isOccupied ? "occupied-seat" : "free-seat"}
        >
          {isOccupied ? "Occupied" : "Free"}
        </div>
      );
    }

    return (
      <div>
        <h3>Select Travel Date</h3>
        {/* Input field for selecting travel date */}
        <div className="date-picker-container">
          <input
            type="date"
            value={this.state.selectedDate}
            onChange={this.handleDateChange}
            required
          />
        </div>
        <div className="seating-grid">
          {selectedDate ? (
            <>
              {/* Display the seat grid */}
              {seats}
              <div>
                {/* Display free seats count */}
                <p>Total Free Seats: {freeSeatCount}</p>
              </div>
            </>
          ) : (
            <p>Please select a travel date to view seat availability</p>
          )}
        </div>
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
    // Ensure the name is valid
    if (!name || typeof name !== 'string') {
      console.error("Invalid traveller name:", name);
      return;
    }

    // Delete a passenger by filtering out the traveller with the provided name
    const newTravellers = this.state.travellers.filter(traveller => traveller.name.toLowerCase() !== name.toLowerCase());

    // Update the state with the new travellers list
    this.setState({ travellers: newTravellers }, () => {
      console.log(`Traveller "${name}" deleted successfully.`);
    });
  }

  render() {
    const { selector, travellers } = this.state;
    let content;

    if (selector === 1) content = <Homepage travellers={travellers} />;
    if (selector === 2) content = <Display travellers={travellers} />;
    if (selector === 3) content = <Add bookTraveller={this.bookTraveller} travellers={travellers} />;
    if (selector === 4) content = <Delete deleteTraveller={this.deleteTraveller} travellers={travellers} />;

    console.log("Current selector:", selector);
    return (
      <div>
        <h1>Ticket To Ride</h1>
        <nav>
          <ul className="nav-menu">
            <li>
              <a href="#homepage" onClick={() => this.setSelector(1)}>Homepage</a>
            </li>
            <li>
              <a href="#view-travellers" onClick={() => this.setSelector(2)}>View Travellers</a>
            </li>
            <li>
              <a href="#add-traveller" onClick={() => this.setSelector(3)}>Add Traveller</a>
            </li>
            <li>
              <a href="#delete-traveller" onClick={() => this.setSelector(4)}>Delete Traveller</a>
            </li>
          </ul>
        </nav>
        <div>{content}</div>
      </div>
    );
  }
}

const element = <TicketToRide />;

ReactDOM.render(element, document.getElementById('contents'));