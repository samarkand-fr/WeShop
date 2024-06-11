// Importing moment for date formatting, Heading, Avatar, and Rating from Material-UI.
import moment from "moment";
import Heading from "./Heading";
import { Avatar, Rating } from "@mui/material";

// Interface defining the props for the ListRating component.
interface ListRatingProps {
  product: any; // The product data with reviews.
}

// ListRating component displays product reviews with user details, ratings, and comments.
const ListRating: React.FC<ListRatingProps> = ({ product }) => {
  return (
    // Container for displaying product reviews.
    <div>
      {/* Heading for the product reviews section. */}
      <Heading title="Product Review" />
      {/* Container for displaying individual reviews. */}
      <div className="text-sm mt-2">
        {/* Mapping through product reviews to display each one. */}
        {product.reviews &&
          product.reviews.map((review: any) => {
            return (
              // Container for an individual review.
              <div key={review.id} className="max-w-[300px]">
                {/* User details and date of the review. */}
                <div className="flex gap-2 items-center">
                  <Avatar src={review?.user.image} />
                  <div className="font-semibold">{review?.user.name}</div>
                  <div className="font-light">
                    {moment(review.createdDate).fromNow()}
                  </div>
                </div>
                {/* Rating and comment section. */}
                <div className="mt-2">
                  <Rating value={review.rating} readOnly />
                  <div className="ml-2">{review.comment}</div>
                  <hr className="mt-4 mb-4" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ListRating;
