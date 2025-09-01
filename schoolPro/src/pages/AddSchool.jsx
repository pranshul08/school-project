import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { schoolAPI } from '../services/api';
import "../assets/styles/addSchool.css";

const AddSchool = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      console.log('Form data received:', data);
      
      // Prepare school data (excluding image file)
      const schoolData = {
        school_name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        contact: data.contact,
        email: data.email_id,
      };

      // Get image file if provided
      const imageFile = data.image && data.image[0] ? data.image[0] : null;
      
      console.log('School data to send:', schoolData);
      console.log('Image file:', imageFile);

      // Submit school data with image in single API call
      const result = await schoolAPI.createSchool(schoolData, imageFile);
      
      console.log('API result:', result);
      
      if (result.success) {
        setSubmitMessage('School added successfully!');
        reset(); // Reset form after successful submission
      } else {
        setSubmitError('Failed to add school: ' + result.error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('An unexpected error occurred: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">School Name: </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="border w-full p-2 rounded"
            placeholder="School Name"
          />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>

        <div className='flex address_inputs'>
          <label className="block mb-1 font-medium">Address: </label>
          <textarea
            {...register('address', { required: 'Address is required' })}
            className="border w-full p-2 rounded"
            placeholder="Address"
          />
          {errors.address && <p className="text-red-600">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">City: </label>
          <input
            {...register('city', { required: 'City is required' })}
            className="border w-full p-2 rounded"
            placeholder="City"
          />
          {errors.city && <p className="text-red-600">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">State: </label>
          <input
            {...register('state', { required: 'State is required' })}
            className="border w-full p-2 rounded"
            placeholder="State"
          />
          {errors.state && <p className="text-red-600">{errors.state.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact Number: </label>
          <input
            type="tel"
            {...register('contact', {
              required: 'Contact is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Enter a valid 10-digit number',
              },
            })}
            className="border w-full p-2 rounded"
            placeholder="Contact Number"
          />
          {errors.contact && <p className="text-red-600">{errors.contact.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email: </label>
          <input
            type="email"
            {...register('email_id', {
              required: 'Email is required',
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: 'Enter a valid email address',
              },
            })}
            className="border w-full p-2 rounded"
            placeholder="Email"
          />
          {errors.email_id && <p className="text-red-600">{errors.email_id.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Image: </label>
          <input
            type="file"
            {...register('image', { required: 'Image is required' })}
            className="border w-full p-2 rounded"
            accept="image/*"
          />
          {errors.image && <p className="text-red-600">{errors.image.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isSubmitting ? 'Adding School...' : 'Add School'}
        </button>

        {/* Status Messages */}
        {submitMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {submitMessage}
          </div>
        )}
        
        {submitError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}
      </form>
    </div>
  )
}

export default AddSchool