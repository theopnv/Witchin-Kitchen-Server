export class Codes {
  static MAKE_GAME_ERROR: number = 211;
  
  static REGISTER_PLAYERS_SUCCESS: number = 220;
  static REGISTER_PLAYERS_ERROR: number = 221;

  static QUIT_GAME_SUCCESS: number = 230;
  static QUIT_GAME_ERROR: number = 231;

  static JOIN_GAME_SUCCESS: number = 240;
  static JOIN_GAME_ERROR: number = 241;

  static AUDIENCE_QUIT_GAME_SUCCESS: number = 250;
  static AUDIENCE_QUIT_GAME_ERROR: number = 250;

  static LAUNCH_POLL_SUCCESS: number = 260;
  static LAUNCH_POLL_ERROR: number = 261;

  static VOTE_SUCCESS: number = 270;
  static VOTE_ERROR: number = 271;
  static VOTE_DEADLINE_PASSED: number = 272;

  static LAUNCH_SPELL_CAST_SUCCESS: number = 280;
  static LAUNCH_SPELL_CAST_ERROR: number = 281;

  static SPELL_CASTED_SUCCESS: number = 290;
  //TODO: Error management

  static REGISTER_VIEWER_SUCCESS = 300;
  static REGISTER_VIEWER_ERROR = 301;

  static UPDATE_GAME_SUCCESS = 310;
  static UPDATE_GAME_ERROR = 311;

  static REMATCH_SUCCESS = 320;
  static REMATCH_ERROR = 321;
}