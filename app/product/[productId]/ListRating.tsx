// Import necessary modules and components
import Avatar from "@/app/components/Avatar";
import Heading from "@/app/components/Heading";
import { Rating } from "@mui/material";
import moment from "moment";

// Define the ListRatingProps interface
interface ListRatingProps {
  product: any;
}

// Define the ListRating component
const ListRating: React.FC<ListRatingProps> = ({ product }) => {
  // If there are no reviews for the product, return null
  if (product.reviews.length === 0) return null;

  // Render the ListRating component
  return (
    <div>
      {/* Heading for product reviews */}
      <Heading title="Product Review" />

      {/* Container for displaying product reviews */}
      <div className="mt-2 text-sm">
        {/* Map through each review in the product and display its details */}
        {product.reviews &&
          product.reviews.map((review: any) => {
            return (
              <div key={review.id} className="max-w-300px">
                {/* User details section */}
                <div className="flex items-center gap-2">
                  {/* User avatar */}
                  <Avatar src={review?.user.image} />

                  {/* User name and review timestamp */}
                  <div className="font-semibold">{review?.user.name}</div>
                  <div className="font-light">
                    {moment(review.createdDate).fromNow()}
                  </div>
                </div>

                {/* Review details section */}
                <div className="mt-2">
                  {/* Star rating */}
                  <Rating value={review.rating} readOnly />

                  {/* Comment text */}
                  <div className="ml-2">{review.comment}</div>

                  {/* Horizontal rule for visual separation between reviews */}
                  <hr className="mt-4 mb-4" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// Export the ListRating component
export default ListRating;
