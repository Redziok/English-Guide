using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mingielewiczinzynierka.Migrations
{
    /// <inheritdoc />
    public partial class fixunique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Translations_sectionId_idText",
                table: "Translations");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: 1,
                column: "password",
                value: "$2a$11$49Lbe.6QAiCZK4ZtmgcpYOyZeSnpDkc834WO0bNMrb90CzpfnuJUa");

            migrationBuilder.CreateIndex(
                name: "IX_Translations_sectionId_idText_language",
                table: "Translations",
                columns: new[] { "sectionId", "idText", "language" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Translations_sectionId_idText_language",
                table: "Translations");

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
        }
    }
}
