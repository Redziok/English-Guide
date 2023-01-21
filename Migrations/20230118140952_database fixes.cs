using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace mingielewiczinzynierka.Migrations
{
    /// <inheritdoc />
    public partial class databasefixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ratings_Translations_idTranslation",
                table: "Ratings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Translations",
                table: "Translations");

            migrationBuilder.DropIndex(
                name: "IX_Translations_translationLanguage_idText",
                table: "Translations");

            migrationBuilder.RenameColumn(
                name: "admin",
                table: "Users",
                newName: "isAdmin");

            migrationBuilder.RenameColumn(
                name: "idUser",
                table: "Users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "translationLanguage",
                table: "Translations",
                newName: "language");

            migrationBuilder.RenameColumn(
                name: "idTranslation",
                table: "Translations",
                newName: "sectionId");

            migrationBuilder.RenameColumn(
                name: "textLanguage",
                table: "Texts",
                newName: "language");

            migrationBuilder.RenameColumn(
                name: "idText",
                table: "Texts",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ratingValue",
                table: "Ratings",
                newName: "rating");

            migrationBuilder.RenameColumn(
                name: "idRating",
                table: "Ratings",
                newName: "id");

            migrationBuilder.AlterColumn<int>(
                name: "sectionId",
                table: "Translations",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "id",
                table: "Translations",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Translations",
                table: "Translations",
                column: "id");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: 1,
                column: "password",
                value: "$2a$11$adu9drukiDn2YAxbdb4aceHRA01pYGBHCclBVzrPEY8Eb4/fnHSGi");

            migrationBuilder.CreateIndex(
                name: "IX_Translations_sectionId_idText",
                table: "Translations",
                columns: new[] { "sectionId", "idText" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Ratings_Translations_idTranslation",
                table: "Ratings",
                column: "idTranslation",
                principalTable: "Translations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ratings_Translations_idTranslation",
                table: "Ratings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Translations",
                table: "Translations");

            migrationBuilder.DropIndex(
                name: "IX_Translations_sectionId_idText",
                table: "Translations");

            migrationBuilder.DropColumn(
                name: "id",
                table: "Translations");

            migrationBuilder.RenameColumn(
                name: "isAdmin",
                table: "Users",
                newName: "admin");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "idUser");

            migrationBuilder.RenameColumn(
                name: "sectionId",
                table: "Translations",
                newName: "idTranslation");

            migrationBuilder.RenameColumn(
                name: "language",
                table: "Translations",
                newName: "translationLanguage");

            migrationBuilder.RenameColumn(
                name: "language",
                table: "Texts",
                newName: "textLanguage");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Texts",
                newName: "idText");

            migrationBuilder.RenameColumn(
                name: "rating",
                table: "Ratings",
                newName: "ratingValue");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Ratings",
                newName: "idRating");

            migrationBuilder.AlterColumn<int>(
                name: "idTranslation",
                table: "Translations",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Translations",
                table: "Translations",
                column: "idTranslation");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "idUser",
                keyValue: 1,
                column: "password",
                value: "$2a$11$Y9SkY1qMvWmOtkFYU0iLPezst4YSKC0AnrmE8YTt/9pgqq7rXIuTu");

            migrationBuilder.CreateIndex(
                name: "IX_Translations_translationLanguage_idText",
                table: "Translations",
                columns: new[] { "translationLanguage", "idText" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Ratings_Translations_idTranslation",
                table: "Ratings",
                column: "idTranslation",
                principalTable: "Translations",
                principalColumn: "idTranslation",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
