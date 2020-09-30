import {MigrationInterface, QueryRunner} from "typeorm";

export class AddService1605525995105 implements MigrationInterface {
    name = 'AddService1605525995105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying NOT NULL, "formId" uuid NOT NULL, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe7734606bfe4fa24cc90e4a91" ON "service" ("url") `);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_02a530232a368d9e7054c3be809" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_02a530232a368d9e7054c3be809"`);
        await queryRunner.query(`DROP INDEX "IDX_fe7734606bfe4fa24cc90e4a91"`);
        await queryRunner.query(`DROP TABLE "service"`);
    }

}
