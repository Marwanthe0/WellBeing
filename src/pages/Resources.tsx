import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Calendar, Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Resources = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { appointments, bookAppointment } = useData();

  const therapists = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Anxiety & Depression',
      email: 'sarah.johnson@wellbeing.com',
      phone: '(555) 123-4567',
      location: 'Downtown Office',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      bio: 'Dr. Johnson specializes in cognitive behavioral therapy with over 10 years of experience helping clients manage anxiety and depression.',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Trauma & PTSD',
      email: 'michael.chen@wellbeing.com',
      phone: '(555) 234-5678',
      location: 'Northside Clinic',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      bio: 'Dr. Chen is a trauma specialist who uses EMDR and other evidence-based approaches to help clients heal from traumatic experiences.',
      image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Relationship & Family Therapy',
      email: 'emily.rodriguez@wellbeing.com',
      phone: '(555) 345-6789',
      location: 'Family Wellness Center',
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      bio: 'Dr. Rodriguez helps couples and families improve communication and resolve conflicts through systemic therapy approaches.',
      image: 'https://images.pexels.com/photos/5327654/pexels-photo-5327654.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialization: 'Addiction & Recovery',
      email: 'james.wilson@wellbeing.com',
      phone: '(555) 456-7890',
      location: 'Recovery Center',
      availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
      bio: 'Dr. Wilson supports individuals in their recovery journey using motivational interviewing and cognitive behavioral approaches.',
      image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ];

  const emergencyResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 crisis support and suicide prevention'
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Free, 24/7 support via text message'
    },
    {
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      description: 'Treatment referral and information service'
    },
    {
      name: 'National Domestic Violence Hotline',
      phone: '1-800-799-7233',
      description: '24/7 support for domestic violence survivors'
    }
  ];

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTherapist || !appointmentDate || !appointmentTime) return;

    bookAppointment(selectedTherapist, appointmentDate, appointmentTime);
    setBookingSuccess(true);
    setSelectedTherapist(null);
    setAppointmentDate('');
    setAppointmentTime('');

    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const getAppointmentCount = (therapistId: string) => {
    return appointments.filter(apt => apt.therapistId === therapistId).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mental Health Resources</h1>
        <p className="text-lg text-gray-600">
          Connect with professional therapists and access crisis support resources
        </p>
      </div>

      {/* Success Message */}
      {bookingSuccess && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800">
              Appointment booked successfully! The therapist will contact you to confirm the details.
            </p>
          </div>
        </div>
      )}

      {/* Emergency Resources */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-red-900">Crisis Support Resources</h2>
            <p className="text-red-700">If you're in crisis or need immediate help, please reach out:</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyResources.map((resource, index) => (
            <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{resource.name}</h3>
              <p className="text-red-600 font-mono text-lg mb-2">{resource.phone}</p>
              <p className="text-gray-600 text-sm">{resource.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Therapist Directory */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Therapists</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {therapists.map((therapist) => (
            <div key={therapist.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={therapist.image}
                  alt={therapist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{therapist.name}</h3>
                  <p className="text-blue-600 font-medium">{therapist.specialization}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {therapist.location}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{therapist.bio}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {therapist.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {therapist.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Available: {therapist.availableDays.join(', ')}
                </div>
              </div>

              <button
                onClick={() => setSelectedTherapist(therapist.id)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Book Appointment
              </button>

              {getAppointmentCount(therapist.id) > 0 && (
                <p className="text-sm text-green-600 mt-2 text-center">
                  You have {getAppointmentCount(therapist.id)} appointment(s) with this therapist
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedTherapist && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Appointment</h3>
            
            <div className="mb-4">
              <p className="text-gray-600">
                Booking with: <span className="font-medium">
                  {therapists.find(t => t.id === selectedTherapist)?.name}
                </span>
              </p>
            </div>

            <form onSubmit={handleBookAppointment}>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <select
                  id="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTherapist(null);
                    setAppointmentDate('');
                    setAppointmentTime('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Appointments */}
      {appointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h2>
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const therapist = therapists.find(t => t.id === appointment.therapistId);
              return (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{therapist?.name}</h3>
                      <p className="text-gray-600">{therapist?.specialization}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;