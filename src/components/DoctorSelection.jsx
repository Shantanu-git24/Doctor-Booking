import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import imgDummy from '../assets/img-dummy.png'


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
`;

const Heading = styled.h1`
  margin-bottom: 20px;
  text-align:center;
  font-weight: 400;
`;


const DoctorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
`;

const DoctorCard = styled.div`
  padding: 20px;
  width: 150px;
  cursor: pointer;
  text-align: center;
`;

const DoctorImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 10px;
`;

const DoctorSelection = () => {
  const navigate = useNavigate();
  const doctors = ["Doctor 1", "Doctor 2"]; 

  const handleDoctorSelect = (doctor) => {
    navigate('/book', { state: { doctor } });
  };

  return (
    <div>
    <Heading>Choose Doctor</Heading>
    <Container>
      <DoctorsContainer>
        {doctors.map((doctor, index) => (
          <DoctorCard key={index} onClick={() => handleDoctorSelect(doctor)}>
            <DoctorImage src={imgDummy} alt={doctor} />
            <p>{doctor}</p>
          </DoctorCard>
        ))}
      </DoctorsContainer>
    </Container>
    </div>
  );
  
};

export default DoctorSelection;
