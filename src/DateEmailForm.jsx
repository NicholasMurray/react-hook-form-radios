import React, { forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";

// Separate uncontrolled Date Input component
const DateInput = forwardRef(({ onChange, value = { day: "", month: "", year: "" }, error }, ref) => {
  // Handle internal changes and propagate them up
  const handleChange = (field, e) => {
    const newValue = {
      ...value,
      [field]: e.target.value
    };
    
    // Call the onChange from Controller to update form state
    onChange(newValue);
  };
  
  return (
    <div>
      <div className="flex space-x-2">
        {/* Day Input */}
        <div className="w-1/4">
          <input
            type="text"
            placeholder="DD"
            value={value.day || ""}
            onChange={(e) => handleChange("day", e)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {/* Month Input */}
        <div className="w-1/4">
          <input
            type="text"
            placeholder="MM"
            value={value.month || ""}
            onChange={(e) => handleChange("month", e)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        {/* Year Input */}
        <div className="w-2/4">
          <input
            type="text"
            placeholder="YYYY"
            value={value.year || ""}
            onChange={(e) => handleChange("year", e)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      {/* Show error if passed from controller */}
      {error && (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
});

const DateEmailForm = () => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitted } 
  } = useForm({
    mode: "onSubmit", // Only validate on submit
    reValidateMode: "onSubmit", // Only revalidate on submit
    defaultValues: {
      date: { day: "", month: "", year: "" },
      email: ""
    }
  });

  // Custom validation function for the date component
  const validateDate = (dateObj) => {
    // Check if all fields are provided
    if (!dateObj.day || !dateObj.month || !dateObj.year) {
      return "All date fields are required";
    }
    
    // Check day value
    const day = parseInt(dateObj.day, 10);
    if (isNaN(day) || day < 1 || day > 31) {
      return "Invalid day (must be 1-31)";
    }
    
    // Check month value
    const month = parseInt(dateObj.month, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      return "Invalid month (must be 1-12)";
    }
    
    // Check year value
    const year = parseInt(dateObj.year, 10);
    if (isNaN(year) || dateObj.year.length !== 4) {
      return "Invalid year (must be 4 digits)";
    }
    
    return true;
  };

  const onSubmit = (data) => {
    // Format the date properly
    const { day, month, year } = data.date;
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    console.log({ 
      date: formattedDate,
      email: data.email 
    });
    
    alert(`Form submitted with date: ${formattedDate} and email: ${data.email}`);
  };

  // Function to handle form errors if needed
  const onError = (errors) => {
    console.log("Form errors:", errors);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Registration Form</h2>
      
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Date Input wrapped in Controller */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date (DD/MM/YYYY) <span className="text-red-500">*</span>
          </label>
          
          <Controller
            name="date"
            control={control}
            rules={{ 
              validate: validateDate
            }}
            render={({ field, fieldState }) => (
              <DateInput
                {...field}
                // Only show error after form is submitted
                error={isSubmitted ? fieldState.error?.message : undefined}
              />
            )}
          />
        </div>
        
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  type="email"
                  placeholder="your@email.com"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {/* Only show error after form is submitted */}
                {isSubmitted && fieldState.error && (
                  <p className="mt-1 text-red-500 text-sm">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DateEmailForm;