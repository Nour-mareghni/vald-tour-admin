import { useState } from 'react';
import { 
  TextField, 
  Button,
  MenuItem,
  Stack,
  Divider,
  Typography
} from '@mui/material';

// Pre-defined standard fields
const STANDARD_FIELDS = [
  { name: 'name', label: 'Tournament Name', type: 'text', required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'city', label: 'City', type: 'text', required: true },
  { name: 'country', label: 'Country', type: 'text', required: true },
  { name: 'venue', label: 'Venue', type: 'text', required: true },
  { name: 'entryFee', label: 'Entry Fee', type: 'number', required: false },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select',
    options: ['upcoming', 'ongoing', 'completed'],
    required: true 
  }
];

export default function TournamentForm({ onSubmit }) {
  // Initialize form with standard fields
  const [formData, setFormData] = useState(
    STANDARD_FIELDS.reduce((acc, field) => {
      acc[field.name] = field.type === 'number' ? 0 : '';
      return acc;
    }, {})
  );

  const [customFields, setCustomFields] = useState([]);
  const [newCustomField, setNewCustomField] = useState({ 
    name: '', 
    type: 'text' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addCustomField = () => {
    if (!newCustomField.name) return;
    
    setCustomFields([...customFields, newCustomField]);
    setFormData({
      ...formData,
      [newCustomField.name]: newCustomField.type === 'number' ? 0 : ''
    });
    setNewCustomField({ name: '', type: 'text' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Typography variant="h6">Standard Tournament Fields</Typography>
        
        {/* Render standard fields */}
        {STANDARD_FIELDS.map((field) => (
          field.type === 'select' ? (
            <TextField
              key={field.name}
              select
              label={field.label}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
              required={field.required}
            >
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type}
              InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
              value={formData[field.name] || ''}
              onChange={(e) => setFormData({
                ...formData, 
                [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value
              })}
              required={field.required}
            />
          )
        ))}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6">Custom Fields</Typography>
        
        {/* Render custom fields */}
        {customFields.map((field) => (
          <TextField
            key={field.name}
            label={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({
              ...formData, 
              [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value
            })}
          />
        ))}

        {/* Add new custom field */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Field Name"
            value={newCustomField.name}
            onChange={(e) => setNewCustomField({...newCustomField, name: e.target.value})}
            size="small"
          />
          <TextField
            select
            label="Type"
            value={newCustomField.type}
            onChange={(e) => setNewCustomField({...newCustomField, type: e.target.value})}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="boolean">Yes/No</MenuItem>
          </TextField>
          <Button 
            onClick={addCustomField} 
            variant="outlined"
            disabled={!newCustomField.name}
          >
            Add Field
          </Button>
        </Stack>

        <Button 
          type="submit" 
          variant="contained" 
          size="large"
          sx={{ mt: 3 }}
        >
          Create Tournament
        </Button>
      </Stack>
    </form>
  );
}