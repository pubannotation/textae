script = File.read(__FILE__).split("__END__\n").first
value = DATA.gets

puts value

File.open(__FILE__, 'w') do 
  _1.write script
  _1.write "__END__\n"
  _1.write DATA.read
  _1.write value
end

__END__
Firefox
Android
iPad
