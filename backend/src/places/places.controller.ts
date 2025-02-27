import { Body, Controller, Post } from "@nestjs/common";
import { PlacesService } from "./places.service";
import {
  PlacesListFailureResponseDto,
  PlacesListSuccessResponseDto,
} from "./places.dto";

@Controller()
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post("/getPlacesByLocation")
  public async getNearbyServices(
    @Body() body: { latitude: number; longitude: number; service: string },
  ): Promise<PlacesListSuccessResponseDto<any> | PlacesListFailureResponseDto> {
    const { latitude, longitude, service } = body;
    const result = await this.placesService.getNearbyServices(
      service,
      latitude,
      longitude,
    );

    switch (result.type) {
      case "success":
        return result;
      case "error":
        console.log("ERROR!!");
        return result;
      default:
        console.log("reached default");
        return result;
    }
  }
}
