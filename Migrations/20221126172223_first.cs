using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace mingielewiczinzynierka.Migrations
{
    /// <inheritdoc />
    public partial class first : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    idUser = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    login = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    admin = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    password = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.idUser);
                });

            migrationBuilder.CreateTable(
                name: "Texts",
                columns: table => new
                {
                    idText = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "text", nullable: true),
                    text = table.Column<string>(type: "text", nullable: true),
                    textLanguage = table.Column<string>(type: "text", nullable: true),
                    idUser = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Texts", x => x.idText);
                    table.ForeignKey(
                        name: "FK_Texts_Users_idUser",
                        column: x => x.idUser,
                        principalTable: "Users",
                        principalColumn: "idUser",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Translations",
                columns: table => new
                {
                    idTranslation = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    translatedText = table.Column<string>(type: "text", nullable: true),
                    translationLanguage = table.Column<string>(type: "text", nullable: true),
                    idText = table.Column<int>(type: "integer", nullable: false),
                    idUser = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Translations", x => x.idTranslation);
                    table.ForeignKey(
                        name: "FK_Translations_Texts_idText",
                        column: x => x.idText,
                        principalTable: "Texts",
                        principalColumn: "idText",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Translations_Users_idUser",
                        column: x => x.idUser,
                        principalTable: "Users",
                        principalColumn: "idUser",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ratings",
                columns: table => new
                {
                    idRating = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ratingValue = table.Column<int>(type: "integer", nullable: false),
                    idUser = table.Column<int>(type: "integer", nullable: false),
                    idTranslation = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ratings", x => x.idRating);
                    table.ForeignKey(
                        name: "FK_Ratings_Translations_idTranslation",
                        column: x => x.idTranslation,
                        principalTable: "Translations",
                        principalColumn: "idTranslation",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Ratings_Users_idUser",
                        column: x => x.idUser,
                        principalTable: "Users",
                        principalColumn: "idUser",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "idUser", "admin", "email", "login", "password" },
                values: new object[] { 1, true, "Redziok@wp.pl", "Redziok", "$2a$11$ySwH3npOz/X8jG11tvgjv.hJTMwwjc4Grvc6aqiyGy/GCtgcY2Y2i" });

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_idTranslation",
                table: "Ratings",
                column: "idTranslation");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_idUser_idTranslation",
                table: "Ratings",
                columns: new[] { "idUser", "idTranslation" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Texts_idUser",
                table: "Texts",
                column: "idUser");

            migrationBuilder.CreateIndex(
                name: "IX_Translations_idText",
                table: "Translations",
                column: "idText");

            migrationBuilder.CreateIndex(
                name: "IX_Translations_idUser",
                table: "Translations",
                column: "idUser");

            migrationBuilder.CreateIndex(
                name: "IX_Users_email",
                table: "Users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_login",
                table: "Users",
                column: "login",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ratings");

            migrationBuilder.DropTable(
                name: "Translations");

            migrationBuilder.DropTable(
                name: "Texts");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
