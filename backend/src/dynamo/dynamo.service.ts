import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { IUser } from "./types";

@Injectable()
export class DynamoService {
  private docClient: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>("AWS_REGION");

    // Initialize DynamoDB Client
    const client = new DynamoDBClient({ region });

    // Initialize Document Client
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  // ✅ Add a user to the authentication table
  async addUser(email: string, passwordHash: string) {
    const tableName = this.configService.get<string>(
      "AUTHENTICATION_TABLE_NAME",
    );

    const command = new PutCommand({
      TableName: tableName,
      Item: {
        email: email.toLowerCase(), // Ensure email is always stored in lowercase
        passwordHash: passwordHash,
      },
      ConditionExpression: "attribute_not_exists(email)",
    });

    return await this.docClient.send(command);
  }

  // ✅ Get a user by email from the authentication table
  async getUser(email: string): Promise<IUser | null> {
    const tableName = this.configService.get<string>(
      "AUTHENTICATION_TABLE_NAME",
    );

    const command = new GetCommand({
      TableName: tableName,
      Key: { email: email.toLowerCase() }, // Query using lowercase email
    });

    const result = await this.docClient.send(command);

    if (!result.Item) {
      console.error(`No user found with email: ${email}`);
      return null;
    }

    return result.Item as IUser; // Returns the user item
  }
}
