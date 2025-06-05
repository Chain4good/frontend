import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FundGallery = ({ images, onImageClick }) => {
  return (
    <Carousel className="w-full">
      <CarouselContent className="ml-2 md:ml-4">
        {images?.map((image, index) => (
          <CarouselItem
            key={index}
            className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div
              className="rounded-md aspect-square overflow-hidden cursor-pointer"
              onClick={() => onImageClick(image.url)}
            >
              <img
                src={image.url}
                alt=""
                className="object-cover w-full h-full"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default FundGallery;
