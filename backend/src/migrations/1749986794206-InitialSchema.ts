import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1749986794206 implements MigrationInterface {
    name = 'InitialSchema1749986794206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "action" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "interval" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "goalId" uuid, CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "goal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "deadline" date NOT NULL, CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "action" ADD CONSTRAINT "FK_efb8c9e6255b45f8808cade08d5" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" DROP CONSTRAINT "FK_efb8c9e6255b45f8808cade08d5"`);
        await queryRunner.query(`DROP TABLE "goal"`);
        await queryRunner.query(`DROP TABLE "action"`);
    }

}
