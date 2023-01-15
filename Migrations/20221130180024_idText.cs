using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mingielewiczinzynierka.Migrations
{
    /// <inheritdoc />
    public partial class idText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "idText",
                table: "Ratings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "idUser",
                keyValue: 1,
                column: "password",
                value: "$2a$11$vrzuHQ9qziGNz8ld6HI8BuzldAMadEFUgSkK.zhj/W.5ZgkCMJDFK");

            migrationBuilder.CreateIndex(
                name: "IX_Translations_translationLanguage_idText",
                table: "Translations",
                columns: new[] { "translationLanguage", "idText" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_idText",
                table: "Ratings",
                column: "idText");

            migrationBuilder.AddForeignKey(
                name: "FK_Ratings_Texts_idText",
                table: "Ratings",
                column: "idText",
                principalTable: "Texts",
                principalColumn: "idText",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ratings_Texts_idText",
                table: "Ratings");

            migrationBuilder.DropIndex(
                name: "IX_Translations_translationLanguage_idText",
                table: "Translations");

            migrationBuilder.DropIndex(
                name: "IX_Ratings_idText",
                table: "Ratings");

            migrationBuilder.DropColumn(
                name: "idText",
                table: "Ratings");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "idUser",
                keyValue: 1,
                column: "password",
                value: "$2a$11$ySwH3npOz/X8jG11tvgjv.hJTMwwjc4Grvc6aqiyGy/GCtgcY2Y2i");
        }
    }
}
