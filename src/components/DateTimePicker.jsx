import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px;
`;

const LeftSection = styled.div`
  flex: 1;
  padding: 50px;
`;

const RightSection = styled.div`
  flex: 1;
  padding: 60px;
`;

const DateContainer = styled.div`
  margin: 40px 150px 0 100px;
`;

const H2=styled.h2`
text-align:center;
padding:0 5px 5px -5px;
`

const TimeContainer = styled.div`
  margin: 20px 0;
  text-align: left;
`;

const TimeSlot = styled.button`
  padding: 10px;
  margin: 5px 5px 5px 0;
  background-color: ${({ selected, booked }) => (booked ? '#ccc' : selected ? '#007bff' : '#fff')};
  color: ${({ selected }) => (selected ? '#fff' : '#000')};
  cursor: ${({ booked }) => (booked ? 'not-allowed' : 'pointer')};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0 15px;
`;

const Input = styled.input`
  flex: 1;
  padding: 15px;
  margin: 0 25px 5px 0px;
  font-size: 1rem;
  border: 1px solid #ccc;
  background-color:#F0F0F0;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  padding: 15px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  width: 150px;
  align-self: flex-start;
  font-size: 1rem;
`;

const DateTimePicker = () => {
  const location = useLocation();
  const { doctor } = location.state || {};

  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const timeSlots = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const response = await axios.get('http://localhost:5000/appointments');
        const appointments = response.data.filter((appointment) =>
          appointment.doctor === doctor && new Date(appointment.date).toDateString() === date.toDateString()
        );
        setBookedSlots(appointments.map((appointment) => appointment.time));

      } catch (error) {
        console.error('Error fetching booked slots', error);
      }
    };

    fetchBookedSlots();
  }, [date, doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));

  };

  const validate = () => {
    const newErrors = {};
    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    if (!details.firstName) newErrors.firstName = 'First Name is required';
    else if (!namePattern.test(details.firstName)) newErrors.firstName = 'First Name must contain only letters';

    if (!details.lastName) newErrors.lastName = 'Last Name is required';
    else if (!namePattern.test(details.lastName)) newErrors.lastName = 'Last Name must contain only letters';

    if (!details.email) newErrors.email = 'Email is required';
    else if (!emailPattern.test(details.email)) newErrors.email = 'Email is not valid';

    if (!details.phone) newErrors.phone = 'Phone is required';
    else if (!phonePattern.test(details.phone)) newErrors.phone = 'Phone must be 10 digits';

    if (!time) newErrors.time = 'Time slot is required';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor || !time) {
      alert('Doctor or time not selected');
      return;
    }
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newAppointment = {
      doctorId: doctor.id,
      doctor,
      date: date.toLocaleDateString('en-CA'), // Use 'en-CA' to get YYYY-MM-DD format
      time,
      ...details
    };
    try {
      await axios.post('http://localhost:5000/appointments', newAppointment);
      alert('Appointment booked successfully');
      setBookedSlots([...bookedSlots, time]);
      setTime(null);
      setDetails({ firstName: '', lastName: '', email: '', phone: '' });
      setDate(new Date());
    } catch (error) {
      alert('Error booking appointment');
    }
  };

  return (
    <Container>
      <LeftSection>
        <DateContainer>
          <H2>Choose Date</H2>
          <Calendar onChange={setDate} value={date} />
        </DateContainer>
      </LeftSection>
      
      <RightSection>
        <TimeContainer>
          <h2>Choose Time</h2>
          {timeSlots.map((slot) => (
            <TimeSlot
              key={slot}
              onClick={() => !bookedSlots.includes(slot) && setTime(slot)}
              booked={bookedSlots.includes(slot)}
              selected={slot === time}
            >
              {slot}
            </TimeSlot>
          ))}
        </TimeContainer>
        <Form onSubmit={handleSubmit}>
          <h2>Details</h2>
          <Row>
            <Input type="text" name="firstName" value={details.firstName} placeholder="First Name" onChange={handleChange} />
            {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
            <Input type="text" name="lastName" value={details.lastName} placeholder="Last Name" onChange={handleChange} />
            {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
          </Row>
          <Row>
            <Input type="email" name="email" value={details.email} placeholder="Email" onChange={handleChange} />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            <Input type="tel" value={details.phone} name="phone" placeholder="Phone" onChange={handleChange} />
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          </Row>
          <SubmitButton type="submit">Submit</SubmitButton>
        </Form>
      </RightSection>
    </Container>
  );
};

export default DateTimePicker;
