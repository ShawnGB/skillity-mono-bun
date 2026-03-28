import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMollieFieldsToBooking1774706480182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" RENAME COLUMN "payment_id" TO "mollie_payment_id"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD COLUMN "paid_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "paid_at"`);
        await queryRunner.query(`ALTER TABLE "booking" RENAME COLUMN "mollie_payment_id" TO "payment_id"`);
    }

}
