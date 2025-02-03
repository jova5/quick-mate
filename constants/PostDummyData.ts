import {PostInterface, PostStatus} from "@/db/collections/posts";
import {Timestamp} from "@firebase/firestore";

export const POST_DUMMY: PostInterface[] = [
  {
    "id": "1",
    "title": "Post Title 1",
    "description": "This is the description for the first post.",
    "price": 150.0,
    "dueDateTime": new Timestamp(1680728463, 123000000),
    "destination": {
      "latitude": 48.8566,
      "longitude": 2.3522
    },
    "contactPhoneNumber": "+1234567890",
    "cityId": "city123",
    "status": PostStatus.OPEN,
    "createdBy": "user1",
    "workerUserId": "worker1",
    "cowerAdditionalCost": true,
    "address": "123 Example St, Paris, France",
    "cityName": "Test"
  },
  {
    "id": "2",
    "title": "Post Title 2",
    "description": "This is the description for the second post.",
    "price": 200.0,
    "dueDateTime": new Timestamp(1680804863, 500000000),
    "destination": {
      "latitude": 51.5074,
      "longitude": -0.1278
    },
    "contactPhoneNumber": "+1987654321",
    "cityId": "city456",
    "status": PostStatus.OPEN,
    "createdBy": "user2",
    "workerUserId": "worker2",
    "cowerAdditionalCost": false,
    "address": "456 Example Rd, London, UK",
    "cityName": "Test"
  },
  {
    "id": "3",
    "title": "Post Title 3",
    "description": "This is the description for the third post.",
    "price": 120.0,
    "dueDateTime": new Timestamp(1680891263, 100000000),
    "destination": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "contactPhoneNumber": "+1123456789",
    "cityId": "city789",
    "status": PostStatus.OPEN,
    "createdBy": "user3",
    "workerUserId": "worker3",
    "cowerAdditionalCost": false,
    "address": "789 Example Ave, New York, USA",
    "cityName": "Test"
  },
  {
    "id": "4",
    "title": "Post Title 3",
    "description": "This is the description for the third post.",
    "price": 120.0,
    "dueDateTime": new Timestamp(1680891263, 100000000),
    "destination": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "contactPhoneNumber": "+1123456789",
    "cityId": "city789",
    "status": PostStatus.OPEN,
    "createdBy": "user3",
    "workerUserId": "worker3",
    "cowerAdditionalCost": false,
    "address": "789 Example Ave, New York, USA",
    "cityName": "Test"
  },
  {
    "id": "5",
    "title": "Post Title 3",
    "description": "This is the description for the third post.",
    "price": 120.0,
    "dueDateTime": new Timestamp(1680891263, 100000000),
    "destination": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "contactPhoneNumber": "+1123456789",
    "cityId": "city789",
    "status": PostStatus.OPEN,
    "createdBy": "user3",
    "workerUserId": "worker3",
    "cowerAdditionalCost": false,
    "address": "789 Example Ave, New York, USA",
    "cityName": "Test"
  }
]
