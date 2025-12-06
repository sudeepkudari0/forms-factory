# Form Factory - Project Documentation

## Overview

**Form Factory** (also known as Forms Factory) is a free, open-source visual form builder application designed for capturing feedback, leads, and opinions. It provides a comprehensive platform for creating, managing, and analyzing forms with advanced collaboration features, API integrations, and webhook support.

## What is Form Factory?

Form Factory is a modern, full-featured form building platform that enables users to:

- Create custom forms with a visual drag-and-drop editor
- Collect and manage form submissions
- Collaborate with teams on form creation and management
- Integrate with external systems via webhooks and API keys
- Export submission data in various formats
- Manage user access and permissions
- Track form analytics and submission metrics

The application is built with modern web technologies and provides both a user-friendly interface for form creators and a robust API for developers.

---

## Core Features

### 1. Form Builder

#### Visual Form Editor
- **Drag-and-drop interface** for creating forms
- **Real-time preview** of forms during editing
- **Field reordering** with drag-and-drop functionality
- **Form duplication** feature to quickly copy existing forms
- **Rich text editor** for form descriptions and headers

#### Form Customization
- **Header and Footer Text**: Add custom header and footer content to forms
- **Form Description**: Rich text descriptions with HTML support
- **Header Images**: Upload and display images in form headers
- **Custom Submit Button Text**: Customize the submit button label
- **WhatsApp Integration**: Configure WhatsApp numbers for submission notifications

#### Form Status Management
- **Publishing Control**: Publish or unpublish forms
- **Archiving**: Archive forms without deleting them
- **Privacy Settings**: Set forms as PUBLIC or PRIVATE
- **Draft Mode**: Save forms as drafts before publishing

### 2. Field Types

The platform supports a comprehensive range of field types:

- **Text**: Single-line text input
- **Textarea**: Multi-line text input
- **Email**: Email address validation
- **Number**: Numeric input with validation
- **URL**: URL validation
- **Date**: Date picker
- **Time**: Time picker
- **Tel**: Phone number input with international format support
- **Checkbox**: Single or multiple checkboxes
- **Dropdown**: Single-select dropdown menu
- **Multi-dropdown**: Multi-select dropdown with custom options
- **Select**: Radio button group selection
- **Upload**: File upload with S3 integration

#### Field Configuration
- **Required/Optional**: Mark fields as required or optional
- **Placeholders**: Add placeholder text for guidance
- **Descriptions**: Provide field descriptions and help text
- **Options**: Configure dropdown and select options
- **Multi-options**: Advanced multi-select with enable/disable per option
- **Field Ordering**: Customize field display order

### 3. Teams & Collaboration

#### Team Management
- **Create Teams**: Organize forms and users into teams
- **Team-based Form Sharing**: Share forms with entire teams
- **Team Members**: Add and manage team members
- **Team Invitations**: Invite users to teams via email
- **Team Forms**: Associate multiple forms with teams
- **User-Team Associations**: Users can belong to multiple teams

#### Collaboration Features
- **Form Sharing**: Share forms with team members
- **Submission Access Control**: 
  - **OWNER**: Full control over submissions
  - **COLLABORATOR**: Shared access to submissions
- **Team-based Permissions**: Control access at team level
- **Shared Submissions**: View and manage submissions shared with you

### 4. Webhooks

#### Webhook Configuration
- **Create Webhooks**: Set up webhook endpoints for form events
- **Event Types**: Configure which events trigger webhooks
  - `FORM_SUBMISSION`: Triggered when a form is submitted
  - `OTHER`: Custom event types
- **Secret Keys**: Secure webhook endpoints with secret keys
- **Webhook Rotation**: Rotate secret keys for security
- **Enable/Disable**: Toggle webhooks on or off
- **Soft Delete**: Mark webhooks as deleted without permanent removal

#### Webhook Events
- **Event Tracking**: Track all webhook events and their status
- **Retry Logic**: Automatic retry mechanism for failed webhook calls
- **Status Monitoring**: 
  - `attempting`: Webhook is being processed
  - `success`: Webhook delivered successfully
  - `failed`: Webhook delivery failed
- **Attempt Tracking**: Monitor retry attempts and next attempt times
- **Status Codes**: Track HTTP response codes from webhook endpoints

### 5. API Keys

#### API Key Management
- **Create API Keys**: Generate secure API keys for programmatic access
- **Key Naming**: Name API keys for easy identification
- **Key Prefixes**: Unique prefixes for key identification (format: `tr_XXXXX`)
- **Key Hashing**: Secure storage using bcrypt hashing
- **Active/Inactive**: Enable or disable API keys
- **Key Deletion**: Remove API keys when no longer needed

#### API Endpoints
- **Submissions API**: Retrieve form submissions using API keys
  - Endpoint: `/api/v1/submissions/[formId]`
  - Authentication: `x-api-key` header
  - Returns: Submitted form data in JSON format

### 6. Submissions Management

#### Submission Features
- **Draft Submissions**: Save form progress as drafts
- **Final Submissions**: Submit completed forms
- **Submission Status**: Track DRAFT and SUBMITTED statuses
- **Submission Data**: Store submission data as JSON
- **Submission Access**: Control who can view submissions
- **Submission Sharing**: Share submissions with collaborators

#### Submission Viewing
- **Submission Table**: View all submissions in a data table
- **Filtering**: Filter submissions by form, user, team, or status
- **Sorting**: Sort submissions by date, status, or other criteria
- **Submission Details**: View complete submission data
- **Submission Export**: Export submissions to CSV format

### 7. Data Export & Import

#### Export Features
- **CSV Export**: Export form submissions to CSV format
- **Excel Support**: Export data compatible with Excel
- **Filtered Exports**: Export submissions filtered by user or team
- **Bulk Export**: Export all submissions for a form

#### Import Features
- **CSV Import**: Import form fields from CSV files
- **Excel Import**: Import form fields from Excel (.xlsx) files
- **Field Mapping**: Automatic mapping of imported fields
- **Template Support**: Use provided Excel templates for imports

### 8. File Uploads

#### Upload Capabilities
- **S3 Integration**: Direct upload to AWS S3 or compatible storage
- **Presigned URLs**: Secure file upload using presigned URLs
- **File Types**: Support for various file types
- **Upload Progress**: Track upload progress
- **File Management**: View and manage uploaded files

### 9. Authentication & User Management

#### Authentication
- **Google OAuth**: Sign in with Google account
- **NextAuth Integration**: Secure authentication using NextAuth.js
- **Session Management**: JWT-based session handling
- **Account Linking**: Link multiple OAuth providers to one account

#### User Roles
- **SUPER_ADMIN**: Full system access and administration
- **USER**: Standard user with form creation and management

#### User Status
- **ACTIVE**: Active user account
- **INACTIVE**: Deactivated user account

#### User Features
- **User Profiles**: Manage user profile information
- **User Settings**: Configure user preferences
- **WhatsApp Integration**: Add WhatsApp number for notifications
- **User Image**: Custom profile images

### 10. Super Admin Panel

#### Administration Features
- **User Management**: 
  - Create, update, and delete users
  - Manage user roles and status
  - Assign users to teams
  - View user submissions
- **Team Management**:
  - Create and manage teams
  - Assign forms to teams
  - Manage team members
  - View team forms and submissions
- **Form Management**:
  - View all forms in the system
  - Manage form access
  - Archive and delete forms
  - View form analytics
- **System Overview**: Dashboard with system-wide statistics

### 11. Notifications & Integrations

#### WhatsApp Notifications
- **Submission Alerts**: Receive WhatsApp notifications when forms are submitted
- **Custom WhatsApp Numbers**: Configure WhatsApp per form or user
- **Formatted Messages**: Receive formatted submission notifications

#### Email Notifications
- **Invitation Emails**: Email invitations for team membership
- **Email Templates**: Customizable email templates
- **Postmark Integration**: Email delivery via Postmark

### 12. Analytics & Reporting

#### Form Analytics
- **Submission Counts**: Track total submissions per form
- **Submission Trends**: View submission patterns over time
- **User Analytics**: Track submissions by user
- **Team Analytics**: View team-level statistics

#### Data Tables
- **Sortable Columns**: Sort data by any column
- **Filterable Data**: Filter submissions and forms
- **Pagination**: Navigate through large datasets
- **Column Customization**: Show/hide columns as needed

### 13. Feedback System

#### User Feedback
- **Feedback Collection**: Collect user feedback on the platform
- **Feedback Tracking**: Store feedback with user agent and URL information
- **Feedback Management**: View and manage user feedback

### 14. Rate Limiting

#### Security Features
- **Rate Limiting**: Protect API endpoints from abuse
- **Upstash Redis**: Rate limiting using Upstash Redis
- **Configurable Limits**: Customizable rate limits per endpoint

### 15. Form Sharing & Access Control

#### Access Management
- **Public Forms**: Forms accessible to anyone with the link
- **Private Forms**: Forms restricted to authorized users
- **Form Sharing**: Share forms with specific users or teams
- **Submission Access**: Control who can view submissions
- **Collaborator Roles**: Assign collaborator access to submissions

---

## Technical Architecture

### Technology Stack

#### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **TanStack Query**: Data fetching and caching
- **Framer Motion**: Animation library

#### Backend
- **Next.js API Routes**: Server-side API endpoints
- **NextAuth.js 5**: Authentication framework
- **Prisma**: Database ORM
- **MongoDB**: NoSQL database
- **Server Actions**: Next.js server actions for mutations

#### Infrastructure & Services
- **Vercel**: Hosting and deployment
- **AWS S3**: File storage
- **Upstash Redis**: Rate limiting and caching
- **Upstash QStash**: Task queue for webhooks
- **Postmark**: Email delivery service

#### Development Tools
- **Biome**: Code formatting and linting
- **Husky**: Git hooks
- **Commitlint**: Commit message linting
- **TypeScript**: Type checking

### Database Schema

#### Core Models
- **User**: User accounts and authentication
- **Form**: Form definitions and metadata
- **Field**: Form field configurations
- **Submission**: Form submission data
- **Teams**: Team/organization structure
- **Webhook**: Webhook configurations
- **ApiKey**: API key management
- **Invitation**: Team invitation system
- **SubmissionAccess**: Submission sharing and permissions
- **WebhookEvent**: Webhook event tracking
- **Feedback**: User feedback collection

### API Structure

#### Public APIs
- `/api/v1/submissions/[formId]`: Get submissions (requires API key)
- `/api/forms/[id]/submissions/export`: Export submissions (CSV)
- `/api/import-form`: Import form fields from CSV/Excel
- `/api/test/webhook`: Test webhook endpoints

#### Authentication
- `/api/auth/[...nextauth]`: NextAuth authentication endpoints

---

## Key Workflows

### Form Creation Workflow
1. User creates a new form with basic information (title, description, submit text)
2. Form is created and associated with user and team
3. User adds fields using the visual editor
4. User configures form settings (header, footer, images, privacy)
5. User publishes the form
6. Form becomes accessible via public URL

### Submission Workflow
1. User visits form URL (`/f/[formId]`)
2. User fills out form fields
3. User can save as draft or submit
4. On submission:
   - Submission data is stored
   - WhatsApp notification is sent (if configured)
   - Webhook events are triggered
   - Submission access is created for form owner

### Team Collaboration Workflow
1. Team admin creates a team
2. Team admin invites users via email
3. Users accept invitations
4. Forms are shared with teams
5. Team members can view and manage shared forms
6. Submissions can be shared with team members as collaborators

### Webhook Workflow
1. User creates webhook with endpoint URL and event types
2. Secret key is generated for webhook
3. On form submission, webhook event is created
4. System attempts to POST to webhook endpoint
5. If successful, event status is updated to "success"
6. If failed, retry logic schedules next attempt
7. Webhook events are tracked for monitoring

---

## Security Features

- **API Key Authentication**: Secure API access with hashed keys
- **Webhook Secret Keys**: Secure webhook endpoints
- **Rate Limiting**: Protection against abuse
- **Session Management**: Secure JWT-based sessions
- **Role-Based Access Control**: User roles and permissions
- **Form Privacy**: Public/private form access control
- **Submission Access Control**: Fine-grained submission permissions
- **OAuth Security**: Secure Google OAuth integration

---

## Deployment

### Environment Variables
- Database connection strings
- OAuth provider credentials
- S3 configuration
- Email service credentials
- Redis configuration
- Application secrets

### Build & Deploy
- **Package Manager**: Bun
- **Build Command**: `next build`
- **Post-build**: Sitemap generation
- **Deployment**: Vercel (configured via `vercel.json`)

---

## License

**AGPL-3.0-or-later**: This project is licensed under the GNU Affero General Public License v3.0 or later, making it free and open-source software.

---

## Project Structure

```
form-factory/
├── src/
│   ├── actions/          # Server actions
│   │   ├── api-key.ts
│   │   ├── feedback.ts
│   │   ├── fields.ts
│   │   ├── forms.ts
│   │   ├── submissions.ts
│   │   ├── team.ts
│   │   ├── users.ts
│   │   └── webhooks.ts
│   ├── app/              # Next.js app router
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (dashboard)/  # Dashboard pages
│   │   ├── (editor)/     # Form editor
│   │   ├── (form)/       # Public form pages
│   │   ├── (marketing)/  # Marketing pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── config/           # Configuration files
│   ├── lib/              # Utility libraries
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── prisma/               # Database schema
├── public/               # Static assets
└── package.json          # Dependencies
```

---

## Summary

Form Factory is a comprehensive, feature-rich form building platform that combines ease of use with powerful collaboration and integration capabilities. It supports everything from simple contact forms to complex data collection workflows, with robust team collaboration, webhook integrations, API access, and advanced submission management features.

The platform is designed for both technical and non-technical users, providing a visual form builder interface while also offering programmatic access through APIs and webhooks for developers who need to integrate form data into their own systems.

