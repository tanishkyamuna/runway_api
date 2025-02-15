# PropVid API Documentation how are youu

## Overview
PropVid provides a REST API for generating cinematic property videos from images using AI technology. This documentation outlines the available endpoints, authentication methods, and webhook integrations.

## Base URL
```
https://lbajcpgmohirgxmecdmd.supabase.co
```

## Authentication
All API requests require authentication using a JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Video Generation

#### Create Video
```http
POST /functions/v1/webhook-handler
Content-Type: application/json
```

Request body:
```json
{
  "videoId": "uuid",
  "userId": "uuid",
  "imageUrl": "string",
  "templateId": "uuid",
  "template": {
    "id": "uuid",
    "title": "string",
    "prompt": "string",
    "style": "string",
    "duration": "number"
  }
}
```

Response:
```json
{
  "success": true,
  "videoId": "uuid"
}
```

### Webhook Callbacks

Your system should implement the following webhook endpoints to receive video generation status updates:

#### Video Complete Webhook
```http
POST /your-webhook-endpoint/video-complete
Content-Type: application/json
```

Request body:
```json
{
  "videoId": "uuid",
  "userId": "uuid",
  "videoUrl": "string"
}
```

#### Video Error Webhook
```http
POST /your-webhook-endpoint/video-error
Content-Type: application/json
```

Request body:
```json
{
  "videoId": "uuid",
  "userId": "uuid",
  "error": {
    "message": "string",
    "code": "string"
  }
}
```

## Database Schema

### Videos Table
```sql
videos (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  template_id uuid REFERENCES templates,
  image_path text,
  video_path text,
  status video_status,
  error text,
  created_at timestamptz,
  updated_at timestamptz
)
```

### Video Generations Table
```sql
video_generations (
  id uuid PRIMARY KEY,
  video_id uuid REFERENCES videos,
  status video_status,
  progress integer,
  error text,
  created_at timestamptz,
  updated_at timestamptz
)
```

## Status Codes
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limits
- 100 requests per minute per user
- 1000 requests per day per user

## Error Handling
All errors follow this format:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Example Implementation

```javascript
const createVideo = async (imageUrl, templateId) => {
  const response = await fetch('https://lbajcpgmohirgxmecdmd.supabase.co/functions/v1/webhook-handler', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageUrl,
      templateId,
      template: {
        id: templateId,
        title: 'Cinematic Exterior',
        prompt: 'Create a cinematic property video',
        style: 'cinematic',
        duration: 10
      }
    })
  });

  return response.json();
};
```

## Support
For API support, contact:
- Email: api-support@propvid.com
- Documentation: https://docs.propvid.com
