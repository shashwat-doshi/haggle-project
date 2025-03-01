import { Injectable } from "@nestjs/common";
import axios, { isAxiosError } from "axios";
import {
  PlacesListFailureResponseDto,
  PlacesListSuccessResponseDto,
} from "./places.dto";
import { ConfigService } from "@nestjs/config";

// TODO: Do we want to have this customized?
export const searchRadius = 5000; // 5000 = 5km

export const SERVICE_TYPE_MAP: Record<string, string[]> = {
  plumbing: ["plumber"],
  electrician: ["electrician"],
  "moving services": ["moving_company"],
  "laundry services": ["laundry"],
  mechanic: ["car_repair"],
  salons: [
    "beauty_salon",
    "hair_care",
    "hair_salon",
    "nail_salon",
    "barber_shop",
  ],
  "lawyer services": ["lawyer"],
};

@Injectable()
export class PlacesService {
  private readonly googlePlacesApiKey: string;
  constructor(private configService: ConfigService) {
    this.googlePlacesApiKey = this.configService.get<string>(
      "GOOGLE_PLACES_API_KEY",
    );
  }

  public mapServiceToIncludedTypes(userInput: string): string[] {
    const normalizedInput = userInput.toLowerCase().trim();
    return SERVICE_TYPE_MAP[normalizedInput] || [];
  }

  public async getNearbyServices(
    service: string,
    latitude: number,
    longitude: number,
  ): Promise<PlacesListSuccessResponseDto<any> | PlacesListFailureResponseDto> {
    const includedServices = this.mapServiceToIncludedTypes(service);

    if (includedServices.length === 0) {
      return new PlacesListFailureResponseDto(
        "InvalidServiceType",
        `Service type '${service}' is not supported.`,
      );
    }

    const url = `https://places.googleapis.com/v1/places:searchNearby`;
    const data = {
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: searchRadius,
        },
      },
      includedTypes: includedServices,
      maxResultCount: 10, // Limit results
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": this.googlePlacesApiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location,places.websiteUri", // Note: Spaces are not allowed anywhere in the field list, according to the API Docs: https://developers.google.com/maps/documentation/places/web-service/nearby-search?apix_params=%7B%22fields%22%3A%22*%22%2C%22resource%22%3A%7B%22includedTypes%22%3A%5B%22plumber%22%5D%2C%22maxResultCount%22%3A10%2C%22locationRestriction%22%3A%7B%22circle%22%3A%7B%22center%22%3A%7B%22latitude%22%3A37.7937%2C%22longitude%22%3A-122.3965%7D%2C%22radius%22%3A50000%7D%7D%7D%7D
        },
      });
      return new PlacesListSuccessResponseDto(
        "Places found successfully",
        response.data,
      );
    } catch (error) {
      if (isAxiosError(error)) {
        // Handle Axios specific error
        return new PlacesListFailureResponseDto(
          "AxiosError",
          error.message,
          error.code,
        );
      } else {
        // Handle general error
        return new PlacesListFailureResponseDto(
          "UnknownError",
          "An unknown error occurred.",
        );
      }
    }
  }
}
