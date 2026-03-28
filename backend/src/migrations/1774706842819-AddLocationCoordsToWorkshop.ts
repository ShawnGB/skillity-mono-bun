import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationCoordsToWorkshop1774706842819 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workshop" ADD COLUMN "location_lat" DECIMAL(9,6)`);
        await queryRunner.query(`ALTER TABLE "workshop" ADD COLUMN "location_lng" DECIMAL(9,6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workshop" DROP COLUMN "location_lat"`);
        await queryRunner.query(`ALTER TABLE "workshop" DROP COLUMN "location_lng"`);
    }

}
