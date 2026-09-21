import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "_product_items_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "product_items" ADD CONSTRAINT "product_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_items_v" ADD CONSTRAINT "_product_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "product_items_image_idx" ON "product_items" USING btree ("image_id");
  CREATE INDEX "_product_items_v_version_version_image_idx" ON "_product_items_v" USING btree ("version_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_items" DROP CONSTRAINT "product_items_image_id_media_id_fk";
  
  ALTER TABLE "_product_items_v" DROP CONSTRAINT "_product_items_v_version_image_id_media_id_fk";
  
  DROP INDEX "product_items_image_idx";
  DROP INDEX "_product_items_v_version_version_image_idx";
  ALTER TABLE "product_items" DROP COLUMN "image_id";
  ALTER TABLE "_product_items_v" DROP COLUMN "version_image_id";`)
}
