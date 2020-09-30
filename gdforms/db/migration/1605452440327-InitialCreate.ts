import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialCreate1605452440327 implements MigrationInterface {
    name = 'InitialCreate1605452440327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "definition" jsonb NOT NULL, CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "form"`);
    }

}
