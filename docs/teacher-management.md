# Teacher Management

This document describes the teacher management features available in the LEPA Portal admin interface.

## Features

### 1. Individual Teacher Creation

The **Add Teacher** modal allows administrators to create individual teacher records with the following fields:

- **Full Name** (required): The teacher's full name (e.g., "Dr. Emily Wilson")
- **Email** (required): Valid email address (e.g., "emily.wilson@lepa.edu")
- **Subject** (required): The subject they teach (e.g., "Mathematics")
- **Department** (optional): Department they belong to (e.g., "STEM")
- **Phone Number** (optional): Contact phone number

#### Usage:

1. Navigate to Admin → Teachers
2. Click the "Add Teacher" button
3. Fill in the required fields
4. Click "Add Teacher" to save

### 2. Batch Import via CSV

The **Import CSV** feature allows administrators to import multiple teachers at once using a CSV file.

#### CSV Format Requirements:

The CSV file must include these columns:

- `name` (required): Teacher's full name
- `email` (required): Valid email address
- `subject` (required): Subject taught
- `phone` (optional): Phone number
- `department` (optional): Department

#### CSV Template:

A sample template is available for download:

```
name,email,subject,phone,department
Dr. Emily Wilson,emily.wilson@lepa.edu,Mathematics,+1 (555) 123-4567,STEM
Mr. David Chen,david.chen@lepa.edu,Science,+1 (555) 234-5678,STEM
```

#### Usage:

1. Navigate to Admin → Teachers
2. Click the "Import CSV" button
3. Download the template to see the expected format
4. Prepare your CSV file with teacher data
5. Upload the CSV file
6. Review validation results
7. Click "Import X Teachers" to complete the import

#### Validation:

The system automatically validates:

- Required fields are present
- Email format is valid
- CSV structure is correct
- No duplicate entries

## Data Management

### Teacher Records

Each teacher record includes:

- Unique ID (auto-generated)
- Name, email, subject (required)
- Phone, department (optional)
- Status (defaults to "Active")
- Join date (auto-generated)

### Statistics

The dashboard displays:

- Total number of teachers
- Active teachers count
- Number of departments

## Best Practices

1. **CSV Import**: Use the provided template to ensure correct formatting
2. **Data Quality**: Verify email addresses and phone numbers before import
3. **Batch Size**: For large imports, consider splitting into smaller files
4. **Validation**: Always review the preview before confirming import

## Troubleshooting

### Common CSV Import Issues:

1. **Missing Headers**: Ensure CSV has the required column headers
2. **Invalid Email**: Check email format (must include @ and domain)
3. **Empty Required Fields**: All required fields must have values
4. **File Format**: Ensure file is saved as .csv

### Support

For technical issues or questions about teacher management, contact the system administrator.
