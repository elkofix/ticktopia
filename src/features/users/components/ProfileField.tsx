export const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <div data-testid="profile-field-container">
    <label 
      data-testid="profile-field-label"
      className="block text-sm font-medium text-gray-700"
    >
      {label}
    </label>
    <p 
      data-testid="profile-field-value"
      className="mt-1 text-gray-900"
    >
      {value}
    </p>
  </div>
);